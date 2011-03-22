/**
 * @class Ext.chart.axis.Time
 * @extends Ext.chart.axis.Axis
 *
 * A type of axis whose units are measured in time values. Use this axis
 * for listing dates that you will want to group or dynamically change.
 * If you just want to display dates as categories then use the
 * Category class for axis instead.
 *
 * For example:
 *
  <pre><code>
    axes: [{
        type: 'Time',
        position: 'bottom',
        fields: 'date',
        title: 'Day',
        dateFormat: 'M d',
        groupBy: 'year,month,day',
        aggregateOp: 'sum',

        constrain: true,
        fromDate: '1/1/11',
        toDate: '1/7/11'
    }]
  </code></pre>
 *
 * In this example we're creating a time axis that has as title <em>Day</em>.
 * The field the axis is bound to is <em>date</em>.
 * The date format to use to display the text for the axis labels is <em>M d</em>
 * which is a three letter month abbreviation followed by the day number.
 * The time axis will show values for dates betwee <em>fromDate</em> and <em>toDate</em>.
 * Since <em>constrain</em> is set to true all other values for other dates not between
 * the fromDate and toDate will not be displayed.
 * 
 * @constructor
 */
//Ext.define('Ext.chart.axis.Time', {
Ext.chart.axis.Time = Ext.extend(Ext.chart.axis.Category, {
    /* Begin Definitions */

    //extend: 'Ext.chart.axis.Category',

    //requires: ['Ext.data.Store', 'Ext.data.JsonStore'],

    /* End Definitions */

     /**
      * The minimum value drawn by the axis. If not set explicitly, the axis
      * minimum will be calculated automatically.
      * @property calculateByLabelSize
      * @type Boolean
      */
    calculateByLabelSize: true,
    
     /**
     * Indicates the format the date will be rendered on. 
     * For example: 'M d' will render the dates as 'Jan 30', etc.
      *
     * @property dateFormat
     * @type {String|Boolean}
      */
    dateFormat: false,
    
     /**
     * Indicates the time unit to use for each step. Can be 'day', 'month', 'year' or a comma-separated combination of all of them.
     * Default's 'year,month,day'.
     *
     * @property timeUnit
     * @type {String}
     */
    groupBy: 'year,month,day',
    
    /**
     * Aggregation operation when grouping. Possible options are 'sum', 'avg', 'max', 'min'. Default's 'sum'.
     * 
     * @property aggregateOp
     * @type {String}
      */
    aggregateOp: 'sum',
    
    /**
     * The starting date for the time axis.
     * @property fromDate
     * @type Date
     */
    fromDate: false,
    
    /**
     * The ending date for the time axis.
     * @property toDate
     * @type Date
     */
    toDate: false,
    
    /**
     * An array with two components: The first is the unit of the step (day, month, year, etc). The second one is the number of units for the step (1, 2, etc.).
     * Default's [Ext.Date.DAY, 1].
     * 
     * @property step 
     * @type Array
     */
    step: [Ext.Date.DAY, 1],
    
    /**
     * If true, the values of the chart will be rendered only if they belong between the fromDate and toDate. 
     * If false, the time axis will adapt to the new values by adding/removing steps.
     * Default's [Ext.Date.DAY, 1].
     * 
     * @property constrain 
     * @type Boolean
     */
    constrain: false,
    
    // @private a wrapper for date methods.
    dateMethods: {
        'year': function(date) {
            return date.getFullYear();
        },
        'day': function(date) {
            return date.getDate();
        },
        'month': function(date) {
            return date.getMonth() + 1;
        }
    },
    
    // @private holds aggregate functions.
    aggregateFn: {
        'sum': function(list) {
            var i = 0, l = list.length, acum = 0;
            if (!list.length || isNaN(list[0])) {
                return list[0];
            }
            for (; i < l; i++) {
                acum += list[i];
            }
            return acum;
        },
        'max': function(list) {
            if (!list.length || isNaN(list[0])) {
                return list[0];
            }
            return Math.max.apply(Math, list);
        },
        'min': function(list) {
            if (!list.length || isNaN(list[0])) {
                return list[0];
            }
            return Math.min.apply(Math, list);
        },
        'avg': function(list) {
            var i = 0, l = list.length, acum = 0;
            if (!list.length || isNaN(list[0])) {
                return list[0];
            }
            for (; i < l; i++) {
                acum += list[i];
            }
            return acum / l;
        }
    },
    
    // @private normalized the store to fill date gaps in the time interval.
    constrainDates: function() {
        var fromDate = new Date(this.fromDate),
            toDate = new Date(this.toDate),
            step = this.step,
            field = this.fields,
            store = this.chart.store,
            record, recObj, fieldNames = [], 
            newStore = new Ext.data.Store({
                model: store.model
            });
        
        var getRecordByDate = (function() {
            var index = 0, l = store.getCount();
            return function(date) {
                var rec, recDate;
                for (; index < l; index++) {
                    rec = store.getAt(index);
                    recDate = new Date(rec.get(field));
                    if (+recDate > +date) {
                        return false;
                    } else if (+recDate == +date) {
                        return rec;
                    }
                }
                return false;
            };
        })();
        
        if (!this.constrain) {
            this.chart.filteredStore = this.chart.store;
            return;
        }
        
        while(+fromDate <= +toDate) {
            record = getRecordByDate(fromDate);
            recObj = {};
            if (record) {
                newStore.add(record.data);
            } else {
                newStore.model.prototype.fields.each(function(f) {
                    recObj[f.name] = false;
                });
                recObj.date = fromDate;
                newStore.add(recObj);
            }
            fromDate = Ext.Date.add(fromDate, step[0], step[1]);
        }
        
        this.chart.filteredStore = newStore;
    },
    
    // @private aggregates values if multiple store elements belong to the same time step.
    aggregate: function() {
        var aggStore = {}, 
            aggKeys = [], key, value,
            op = this.aggregateOp,
            field = this.fields, i,
            fields = this.groupBy.split(','),
            curField,
            recFields = [],
            recFieldsLen = 0,
            obj,
            dates = [],
            json = [],
            l = fields.length,
            dateMethods = this.dateMethods,
            aggregateFn = this.aggregateFn,
            store = this.chart.filteredStore || this.chart.store;
        
        store.each(function(rec) {
            //get all record field names in a simple array
            if (!recFields.length) {
                rec.fields.each(function(f) {
                    recFields.push(f.name);
                });
                recFieldsLen = recFields.length;
            }
            //get record date value
            value = new Date(rec.get(field));
            //generate key for grouping records
            for (i = 0; i < l; i++) {
                if (i == 0) {
                    key = String(dateMethods[fields[i]](value));
                } else {
                    key += '||' + dateMethods[fields[i]](value);
                }
            }
            //get aggregation record from hash
            if (key in aggStore) {
                obj = aggStore[key];
            } else {
                obj = aggStore[key] = {};
                aggKeys.push(key);
                dates.push(value);
            }
            //append record values to an aggregation record
            for (i = 0; i < recFieldsLen; i++) {
                curField = recFields[i];
                if (!obj[curField]) {
                    obj[curField] = [];
                }
                if (rec.get(curField) !== undefined) {
                    obj[curField].push(rec.get(curField));
                }
            }
        });
        //perform aggregation operations on fields
        for (key in aggStore) {
            obj = aggStore[key];
            for (i = 0; i < recFieldsLen; i++) {
                curField = recFields[i];
                obj[curField] = aggregateFn[op](obj[curField]);
            }
            json.push(obj);
        }
        
        this.chart.substore = new Ext.data.JsonStore({
            fields: recFields,
            data: json
        });
        
        this.dates = dates;
    },
    
    // @private creates a label array to be used as the axis labels.
     setLabels: function() {
        var store = this.chart.substore,
            fields = this.fields,
            format = this.dateFormat,
            labels, i, dates = this.dates,
            formatFn = Ext.Date.format;
    
        this.labels = labels = [];
        store.each(function(record, i) {
            if (!format) {
                labels.push(record.get(fields));
            } else {
                labels.push(formatFn(dates[i], format));
            }
         }, this);
     },

     // @private modifies the store and creates the labels for the axes.
     applyData: function() {
         //TODO(nico): fix this eventually...
         if (this.constrain) {
             this.constrainDates();
             this.aggregate();
             this.chart.substore = this.chart.filteredStore;
         } else {
             this.aggregate();
         }
         this.setLabels();
        var count = this.chart.substore.getCount();
         return {
             from: 0,
             to: count,
             steps: count - 1
         };
     }
 });

