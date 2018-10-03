import React from 'react';

const UsersList = (props) => {
    return (
        <div>
            <h1 className="title is-1">All Users</h1>
            <hr/><br/>
            {
                props.users.map((user) => {
                    return (
                        <h4
                            key={user.id}
                            className="box title is-4"
                        >{user.username}</h4>
                    )
                })
            }
        </div>
    )
};

export default  UsersList;