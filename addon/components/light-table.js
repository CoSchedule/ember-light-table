import Ember from 'ember';
import layout from '../templates/components/light-table';
import TableScrollMixin from '../mixins/table-scroll';

const {
  computed,
  canInvoke
} = Ember;


/**
 * @module Components
 */

/**
 * @class Light-Table
 * @extends Ember.Component
 * @uses TableScrollMixin
 */

export default Ember.Component.extend(TableScrollMixin, {
  layout,
  tagName: 'table',
  classNames: ['ember-light-table'],
  classNameBindings: ['isLoading', 'canSelect', 'multiSelect', 'isSelecting','canExpand'],

  /**
   * @property table
   * @type {Table}
   */
  table: null,

  /**
   * @property tableActions
   * @type {Object}
   */
  tableActions: null,

  /**
   * @property expandedRowComponent
   * @type {String}
   */
  expandedRowComponent: null,

  /**
   * @property noDataComponent
   * @type {String}
   */
  noDataComponent: null,

  /**
   * @property loadingComponent
   * @type {String}
   */
  loadingComponent: null,

  /**
   * @property noDataText
   * @type {String}
   * @default 'No data.'
   */
  noDataText: 'No data.',

  /**
   * @property canSelect
   * @type {Boolean}
   * @default true
   */
  canSelect: true,

  /**
   * @property multiSelect
   * @type {Boolean}
   * @default true
   */
  multiSelect: false,

  /**
   * @property isLoading
   * @type {Boolean}
   * @default false
   */
  isLoading: false,

  /**
   * @property multiRowExpansion
   * @type {Boolean}
   * @default true
   */
  multiRowExpansion: true,

  /**
   * @property expandOnClick
   * @type {Boolean}
   * @default true
   */
  expandOnClick: true,

  /**
   * @property multiColumnSort
   * @type {Boolean}
   * @default false
   */
  multiColumnSort: false,

  /**
   * @property iconAscending
   * @type {String}
   * @default ''
   */
  iconAscending: '',

  /**
   * @property iconDescending
   * @type {String}
   * @default ''
   */
  iconDescending: '',

  rows: computed.oneWay('table.rows'),
  columns: computed.oneWay('table.columns'),

  canExpand: computed.notEmpty('expandedRowComponent'),
  hasNoData: computed.empty('rows'),

  sortIcons: computed('iconAscending', 'iconDescending', function() {
    return this.getProperties(['iconAscending', 'iconDescending']);
  }),

  visibleColumns: computed.oneWay('table.visibleColumns'),
  visibleColumnGroups: computed.oneWay('table.visibleColumnGroups'),
  visibleSubColumns: computed.oneWay('table.visibleSubColumns'),

  isSelecting: false,
  _currSelectedIndex: -1,
  _prevSelectedIndex: -1,

  togglExpandedRow(row) {
    let multi = this.get('multiRowExpansion');
    let shouldExpand = !row.expanded;

    if(multi) {
      row.toggleProperty('expanded');
    } else {
      this.get('table.expandedRows').setEach('expanded', false);
      row.set('expanded', shouldExpand);
    }
  },

  _callAction(action, ...params) {
    if(canInvoke(this.attrs, action)) {
      this.attrs[action](...params);
    }
  },

  actions: {
    onColumnClick(column) {
      if(column.sortable) {
        if(column.sorted) {
          column.toggleProperty('ascending');
        } else {
          if(!this.get('multiColumnSort')) {
            this.get('table.sortedColumns').setEach('sorted', false);
          }
          column.set('sorted', true);
        }
      }
      this._callAction('onColumnClick', ...arguments);
    },

    onRowClick(row, e) {
      let rows = this.get('table.rows');
      let multiSelect = this.get('multiSelect');
      let canSelect = this.get('canSelect');
      let isSelected = row.get('selected');
      let currIndex = rows.indexOf(row);
      let prevIndex = this._prevSelectedIndex === -1 ? currIndex : this._prevSelectedIndex;

      this._currSelectedIndex = currIndex;
      this._prevSelectedIndex = prevIndex;

      if(canSelect) {
        this.set('isSelecting', true);
        if (e.shiftKey && multiSelect) {
          rows.slice(Math.min(currIndex, prevIndex), Math.max(currIndex, prevIndex) + 1).forEach(r => r.set('selected', !isSelected));
          this._prevSelectedIndex = currIndex;
        } else if((e.ctrlKey || e.metaKey) && multiSelect) {
          row.toggleProperty('selected');
        } else {
          this.set('isSelecting', false);
          this.get('table.selectedRows').setEach('selected', false);
          row.set('selected', !isSelected);

          if (this.get('canExpand') && this.get('expandOnClick')) {
            this.togglExpandedRow(row);
          }
        }
        this._prevSelectedIndex = currIndex;
      } else {
        if (this.get('canExpand') && this.get('expandOnClick')) {
          this.togglExpandedRow(row);
        }
      }

      this._callAction('onRowClick', ...arguments);
   },

    onColumnDoubleClick(/* column */) {
      this._callAction('onColumnDoubleClick', ...arguments);
    },

    onRowDoubleClick(/* row */) {
      this._callAction('onRowDoubleClick', ...arguments);
    },

    onScrolledToBottom() {
      this._callAction('onScrolledToBottom', ...arguments);
    }
  }
});
