import unittest

from project import db
from project.api.models import User
from project.tests.base import BaseTestCase
from project.tests.utils import add_user

from sqlalchemy.exc import IntegrityError

class TestUserModel(BaseTestCase):

    def test_add_user(self):
        user = add_user('justtest','test@test.com', 'greaterthaneight')
        self.assertTrue(user.id)
        self.assertEqual(user.username, 'justtest')
        self.assertEqual(user.email, 'test@test.com')
        self.assertTrue(user.active)

    def test_add_user_duplicate_username(self):
        user = add_user('justtest','test@test.com', 'greaterthaneight')
        duplicate_user = User(
            username='justtest',
            email='test@test2.com',
            password='greaterthaneight'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_add_user_duplicate_email(self):
        user = add_user('justtest', 'test@test.com', 'greaterthaneight')
        duplicate_user = User(
            username='justanothertest',
            email='test@test.com',
            password='greaterthaneight'
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_to_json(self):
        user = add_user('justtest', 'test@test.com', 'greaterthaneight')
        self.assertTrue(isinstance(user.to_json(), dict))

    def test_passwords_are_random(self):
        user_one = add_user('justtest', 'test@test.com', 'greaterthaneight')
        user_two = add_user('justtest2', 'test@test.com2', 'greaterthaneight')
        self.assertNotEqual(user_one.password, user_two.password)

if __name__ == '__main__':
    unittest.main()