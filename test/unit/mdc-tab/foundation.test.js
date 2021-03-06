/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import MDCTabFoundation from '../../../packages/mdc-tab/foundation';

suite('MDCTabFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCTabFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCTabFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTabFoundation, [
    'addClass', 'removeClass', 'hasClass',
    'setAttr',
    'activateIndicator', 'deactivateIndicator',
    'getOffsetLeft', 'getOffsetWidth', 'getContentOffsetLeft', 'getContentOffsetWidth',
    'notifyInteracted',
    'focus',
  ]);
});

const setupTest = () => setupFoundationTest(MDCTabFoundation);

test('#activate does nothing if already active', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ACTIVE), {times: 0});
});

test('#activate adds mdc-tab--active class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.addClass(MDCTabFoundation.cssClasses.ACTIVE));
});

test('#activate sets the root element aria-selected attribute to true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.ARIA_SELECTED, 'true'));
});

test('#activate sets the root element tabindex to 0', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.TABINDEX, '0'));
});

test('#activate activates the indicator', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate({width: 100, left: 200});
  td.verify(mockAdapter.activateIndicator({width: 100, left: 200}));
});

test('#activate focuses the root node', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate({width: 100, left: 200});
  td.verify(mockAdapter.focus());
});

test('#deactivate does nothing if not active', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.addClass, {times: 0});
});

test('#deactivate removes mdc-tab--active class to the root element', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCTabFoundation.cssClasses.ACTIVE));
});

test('#deactivate sets the root element aria-selected attribute to false', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.ARIA_SELECTED, 'false'));
});

test('#deactivate deactivates the indicator', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.deactivateIndicator());
});

test('#deactivate sets the root element tabindex to -1', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(MDCTabFoundation.cssClasses.ACTIVE)).thenReturn(true);
  foundation.deactivate();
  td.verify(mockAdapter.setAttr(MDCTabFoundation.strings.TABINDEX, '-1'));
});

test(`#handleClick emits the ${MDCTabFoundation.strings.INTERACTED_EVENT} event`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleClick();
  td.verify(mockAdapter.notifyInteracted(), {times: 1});
});

test('#computeDimensions() returns the dimensions of the tab', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getOffsetLeft()).thenReturn(10);
  td.when(mockAdapter.getOffsetWidth()).thenReturn(100);
  td.when(mockAdapter.getContentOffsetLeft()).thenReturn(11);
  td.when(mockAdapter.getContentOffsetWidth()).thenReturn(30);
  assert.deepEqual(foundation.computeDimensions(), {
    rootLeft: 10,
    rootRight: 110,
    contentLeft: 21,
    contentRight: 51,
  });
});
