import React, { useState, useEffect } from "react";
import axios from "axios";
import PieGraph from "./pieGraph";
import BarGraph from "./barGraph";
import BarMonthGraph from "./barGraphMonth";
import RadialInteractionsGraph from "./radialInteractionsGraph";
import CirclePackingGraph from "./CirclePackingGraph";
import HeadGraphs from "./headGraph";
import WordCloudGraph from "./wordCloudGraph";
import ListTweets from "./listTweets";

import "rsuite/dist/rsuite.min.css";
import "./App.css";

function Graphs() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    const [topGetData, setTopGetData] = useState(0);
    const [listNbTweetsSentiment, setlistNbTweetsSentiment] = useState([]);
    const [listNbTweetsMonth, setlistNbTweetsMonth] = useState([]);
    const [listNbInteractionsRadiant, setlistNbInteractionsRadiant] = useState([]);
    const [listNbInteractionsCircular, setlistNbInteractionsCircular] = useState([]);
    const [ListFrequentsWords, setListFrequentsWords] = useState([]);
    const [ListTweetsSentiments, setListTweetsSentiments] = useState([]);
    const [nbTweetsInteractions, setNbTweetsInteractions] = useState(0);
    const [nbTweetsAnalys, setNbTweetsAnalys] = useState(0);

    const defsCharts = [
        // using plain object
        {
            id: "gradientNega",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#ff3f3f" },
                { offset: 66, color: "#ab0404" },
            ],
        },
        {
            id: "gradientNeut",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#fff443" },
                { offset: 80, color: "#BA8B02" },
            ],
        },
        {
            id: "gradientPosi",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#42ff42" },
                { offset: 66, color: "#0f9b0f" },
            ],
        },

        {
            id: "gradientLikes",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#ff54cb" },
                { offset: 66, color: "#b81984" },
            ],
        },

        {
            id: "gradientReply",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#626bff" },
                { offset: 66, color: "#1924b8" },
            ],
        },

        {
            id: "gradientRetweet",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#044800 " },
                { offset: 66, color: "#088300" },
            ],
        },
        {
            id: "gradientQuote",
            type: "linearGradient",
            colors: [
                { offset: 0, color: "#6cfeff" },
                { offset: 66, color: "#19b8ac" },
            ],
        },
    ];

    useEffect(() => {
        axios
            .get("/get_tweets_user/" + user.id + "/" + user.name)
            .then((res) => {
                setlistNbTweetsSentiment(res.data[0]);
                setlistNbTweetsMonth(res.data[1]);
                setlistNbInteractionsRadiant(res.data[2]);
                setlistNbInteractionsCircular(res.data[3]);
                setNbTweetsInteractions(res.data[4]);
                setListFrequentsWords(res.data[5]);
                setListTweetsSentiments(res.data[6]);

                setNbTweetsAnalys(
                    res.data[0].reduce(function (sum, current) {
                        return sum + current.value;
                    }, 0)
                );

                setTopGetData(1);
            })
            .catch((error) => {
                console.log("error", error);
            });
    }, []); // Ne s'exécute qu'une seule fois

    return (
        <div className="app-main-charts">
            {topGetData === 0 ? (
                <div className="loader-charts">
                    <p>Preparing graphics</p>
                    <span className="loader"></span>
                </div>
            ) : (
                <div className="main-charts">
                    <HeadGraphs user={user} />

                    <div className="div-charts">
                        <h5>{nbTweetsAnalys} tweets analyzed, only tweets, no retweets, no replies, no quotes</h5>
                        <PieGraph listNbTweetsSentiment={listNbTweetsSentiment} defsCharts={defsCharts} />
                        <BarGraph listNbTweetsSentiment={listNbTweetsSentiment} defsCharts={defsCharts} />
                        <BarMonthGraph listNbTweetsMonth={listNbTweetsMonth} defsCharts={defsCharts} />
                        <div className="charts-interactions">
                            <h4>distribution of the different interactions by sentiments</h4>
                            <h5>{nbTweetsInteractions} tweets analyzed for this result</h5>
                            <CirclePackingGraph listNbInteractionsCircular={listNbInteractionsCircular} defsCharts={defsCharts} />
                            <RadialInteractionsGraph listNbInteractionsRadiant={listNbInteractionsRadiant} defsCharts={defsCharts} />
                        </div>
                        <WordCloudGraph ListFrequentsWords={ListFrequentsWords} />

                        <ListTweets ListTweetsSentiments={ListTweetsSentiments} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Graphs;
