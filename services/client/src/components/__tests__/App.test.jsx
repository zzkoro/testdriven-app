import React from 'react';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

import App from '../../App';

beforeAll(() => {
    global.localStorage = {
        getItem: () => 'someToken'
    };
});

test('App renders without crashing', () => {
    const wrapper = shallow(<App/>);
});

test('App will call componentWillMount when mounted', () => {
    const onWillMOunt = jest.fn();
    App.prototype.componentWillMount = onWillMOunt;
    const wrapper = mount(<Router><App/></Router>);
    expect(onWillMOunt).toHaveBeenCalledTimes(1);
});
