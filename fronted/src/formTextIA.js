import React from "react";
import axios from "axios";
import { Button, Input } from "rsuite";

function FormTextIA(props) {
    const [submitText, setSubmitText] = React.useState("");
    const [resultSentim, setResultSentim] = React.useState("");
    const [topResult, setTopResult] = React.useState(false);
    const [styleTextarea, setStyleTextarea] = React.useState({
        boxShadow: "",
    });

    // btn click user name
    const SubmitForm = (e) => {
        console.log("submitText", submitText);
        axios.get(`/get_sentiment_text/?text=${submitText}`, submitText).then((res) => {
            console.log("res.data[0]", res.data[0]);
            setResultSentim(res.data[0]);

            switch (res.data[0].sentiment) {
                case "Negative":
                    setStyleTextarea({ boxShadow: "0 0 10px 5px #ca0000" });
                    break;
                case "Neutral":
                    setStyleTextarea({ boxShadow: "0 0 10px 5px #d4d000" });
                    break;
                case "Positive":
                    setStyleTextarea({ boxShadow: "0 0 10px 5px #00d413" });
                    break;
            }

            setTopResult(true);
        });
    };

    return (
        <div className="form-text-ia">
            <h4>Text sentiment detection</h4>
            <Input as="textarea" rows={3} placeholder="write your text" onChange={setSubmitText} style={styleTextarea} />
            <Button appearance="primary" type="submit" onClick={SubmitForm}>
                Detect sentiment
            </Button>
            {topResult ? (
                <div className="div-result">
                    <h5>Result</h5>
                    <div className="sentiment">
                        <p>
                            Sentiment: <strong>{resultSentim.sentiment}</strong>
                        </p>
                        <p>score: {resultSentim.score}</p>
                    </div>

                    <div className="score">
                        <p>negative score: {resultSentim.negative}</p>
                        <p>neutral score: {resultSentim.neutral}</p>
                        <p>positive score: {resultSentim.positive}</p>
                    </div>
                </div>
            ) : (
                <p></p>
            )}
        </div>
    );
}

export default FormTextIA;
