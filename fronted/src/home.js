import React, { useState, useEffect } from "react";
import axios from "axios";
import ListUsers from "./listUsers";
import FormTextIA from "./formTextIA";

import { useNavigate, createSearchParams } from "react-router-dom";
import { Form, Schema, Button } from "rsuite";

import "rsuite/dist/rsuite.min.css";
import "./App.css";

function Home() {
    localStorage.clear();
    const navigate = useNavigate();
    var regex = new RegExp(/[-!$%^&*()+|~=`{}[\]:/;<>?,.@#]/g);
    const [resAPI, setResAPI] = useState("");
    const [formError, setFormError] = React.useState({});
    const [username, setUsername] = React.useState({ name: "" });
    const [listUsers, setListUsers] = React.useState([]);

    useEffect(() => {
        axios.get("/userInBD").then((res) => {
            // add user in list
            setListUsers(res.data);
        });
    }, []); // Execute one time

    const checkUsername = (name) => {
        // verif if regex is in name
        if (name.match(regex)) {
            // display error
            return false;
        } else {
            return true;
        }
    };

    // schema for check if name respect conditions
    const { StringType } = Schema.Types;
    const model = Schema.Model({
        name: StringType()
            .addRule((value, data) => {
                return checkUsername(value);
            }, "character not allowed")
            .isRequired("This field is required."),
    });

    // Submit Form
    const formSubmit = (e) => {
        // if formError is empty call APi userName
        if (!formError.name) {
            axios.get("/userName/" + username.name).then((res) => {
                if (res.data[0] === "user exist") {
                    // user exist in twitter
                    // save id and user
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            id: res.data[1],
                            name: res.data[2],
                            location: res.data[3],
                            created_at: res.data[4],
                            description: res.data[5],
                            profile_image_url: res.data[6],
                            public_metrics: res.data[7],
                            url: res.data[8],
                            verified: res.data[9],
                        })
                    );

                    // redirect to /graphsSentiments
                    navigate({
                        pathname: "/graphsSentiments",
                        search: `?${createSearchParams({
                            id: res.data[1],
                            name: res.data[2],
                        })}`,
                    });
                } else {
                    setResAPI(res.data);
                }
            });
        }
    };

    return (
        <div className="home">
            <header className="App-header">
                <FormTextIA />
                <Form onChange={setUsername} formValue={username} model={model} onSubmit={formSubmit} onCheck={setFormError}>
                    <Form.Group controlId="name">
                        <Form.ControlLabel>Username</Form.ControlLabel>
                        <Form.Control name="name" placeholder="@Username" />
                    </Form.Group>
                    <Button appearance="primary" type="submit">
                        Search
                    </Button>
                </Form>

                <p>{resAPI}</p>

                <ListUsers listUsers={listUsers} />
            </header>
        </div>
    );
}

export default Home;
