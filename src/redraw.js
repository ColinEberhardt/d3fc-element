/* eslint-env browser */

import { select } from 'd3-selection';
import * as data from './data';

const find = (element) => element.tagName === 'D3FC-GROUP'
  ? [element, ...element.querySelectorAll('d3fc-canvas, d3fc-group, d3fc-svg')]
  : [element];

const measure = (element) => {
    if (element.tagName === 'D3FC-GROUP') {
        return;
    }
    const { width: previousWidth, height: previousHeight } = data.get(element);
    const width = element.clientWidth;
    const height = element.clientHeight;
    const resized = width !== previousWidth || height !== previousHeight;
    const node = element.childNodes[0];
    const context = node.getContext && node.getContext('2d');
    const selection = select(node);
    data.set(element, { width, height, resized, node, context, selection });
};

const resize = (element) => {
    if (element.tagName === 'D3FC-GROUP') {
        return;
    }
    const detail = data.get(element);
    if (!detail.resized) {
        return;
    }
    detail.node.setAttribute('width', detail.width);
    detail.node.setAttribute('height', detail.height);
    const event = new CustomEvent('resize', { detail });
    element.dispatchEvent(event);
};

const draw = (element) => {
    const detail = data.get(element);
    const event = new CustomEvent('draw', { detail });
    element.dispatchEvent(event);
};

export default (elements) => {
    const allElements = elements.map(find)
      .reduce((a, b) => a.concat(b));
    allElements.forEach(measure);
    allElements.forEach(resize);
    allElements.forEach(draw);
};
