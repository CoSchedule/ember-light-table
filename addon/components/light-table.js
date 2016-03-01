import Ember from 'ember';
import layout from '../templates/components/light-table';
import callAction from '../utils/call-action';
import TableScrollMixin from '../mixins/table-scroll';

const {
  computed
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
   * @property isLoading
   * @type {Boolean}
   * @default false
   */
  isLoading: false,



  rows: computed.oneWay('table.rows'),
  columns: computed.oneWay('table.columns'),

  canExpand: computed.notEmpty('expandedRowComponent'),
  hasNoData: computed.empty('rows'),



  actions: {
    onScrolledToBottom() {
      callAction.call(this, 'onScrolledToBottom', ...arguments);
    }
  }
});
