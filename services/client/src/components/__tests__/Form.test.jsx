import React from 'react';
import { shallow, simulate } from 'enzyme';
import renderer from 'react-test-renderer';
import { MemoryRouter, Switch, Redirect } from 'react-router-dom';

import Form from '../Form';

const testData = [
    {
        formType: 'Register',
        formData: {
            username: '',
            email: '',
            password: ''

        },
        isAuthenticated: false,
        loginUser: jest.fn(),
    },
    {
        formType: 'Login',
        formData: {
            email: '',
            password: ''
        },
        isAuthenticated: false,
        loginUser: jest.fn(),
    }
];

describe('When not authenticated', () => {
    beforeEach(() => {
        console.error = jest.fn();
        console.error.mockClear();
    });
    testData.forEach((el) => {
        const component = <Form {...el} />;
        it(`${el.formType} Form submits the form renders properly`, () => {
            const wrapper = shallow(component);
            wrapper.instance().handleUserFormSubmit = jest.fn();
            wrapper.update();
            const input = wrapper.find('input[type="email"]');
            expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledTimes(0);
            input.simulate(
                'change', { target: { name: 'email', value: 'test@test.com' } }
            );
            wrapper.find('form').simulate('submit', el.formData);
            expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledWith(el.formData);
            expect(wrapper.instance().handleUserFormSubmit).toHaveBeenCalledTimes(1);
        });
    });

});

describe('When authenticated', () => {
    before(() => {
       console.error = jest.fn();
       console.error.mockClear();
    });
    testData.forEach((el) => {
       const component = <Form {...el} />;
       it(`${el.formType} redirects properly`, () => {
          const wrapper = shallow(component);
          expect(wrapper.find('Redirect')).toHaveLength(0);
          expect(console.error).toHaveBeenCalledTimes(0);
       });
    });
});