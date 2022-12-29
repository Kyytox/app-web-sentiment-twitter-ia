import React from "react";
import { Nav, Row, Col } from "rsuite";

const CustomNav = ({ active, onSelect, ...props }) => {
    return (
        <Nav {...props} vertical activeKey={active} onSelect={onSelect}>
            <Nav.Item eventKey="Negative_Tweets">Negative Tweets</Nav.Item>
            <Nav.Item eventKey="Neutral_Tweets">Neutral Tweets</Nav.Item>
            <Nav.Item eventKey="Psotive_Tweets">Psotive Tweets</Nav.Item>
        </Nav>
    );
};

function ListTweets(props) {
    const [active, setActive] = React.useState("Negative_Tweets");

    const TabContent = ({ activeKey }) => {
        if (active === "Negative_Tweets") {
            return <div className="list-tweets">{listTweetsNega}</div>;
        }

        if (active === "Neutral_Tweets") {
            return <div className="list-tweets">{listTweetsNeut}</div>;
        }
        if (active === "Psotive_Tweets") {
            return <div className="list-tweets">{listTweetsPosi}</div>;
        }
    };

    // create list negatvie tweets
    const listTweetsNega = props.ListTweetsSentiments[0].map((x) => (
        <div className="box-tweet">
            <p className="date_tweet">{x[1]}</p>
            <p className="text_tweet">{x[0]}</p>
        </div>
    ));

    // create list neutral tweets
    const listTweetsNeut = props.ListTweetsSentiments[1].map((x) => (
        <div className="box-tweet">
            <p className="date_tweet">{x[1]}</p>
            <p className="text_tweet">{x[0]}</p>
        </div>
    ));

    // create list positive tweets
    const listTweetsPosi = props.ListTweetsSentiments[2].map((x) => (
        <div className="box-tweet">
            <p className="date_tweet">{x[1]}</p>
            <p className="text_tweet">{x[0]}</p>
        </div>
    ));

    console.log("listTweetsNega", listTweetsNega);
    console.log("listTweetsNeut", listTweetsNeut);
    console.log("listTweetsPosi", listTweetsPosi);

    return (
        <div className="div-nav-list-tweets">
            <Row>
                <Col>
                    <CustomNav appearance="tabs" active={active} onSelect={setActive} />
                </Col>
                <TabContent activeKey={active} />
            </Row>
        </div>
    );

    // return <div className="div-list-tweets"></div>;
}

export default ListTweets;
