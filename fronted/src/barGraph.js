import React from "react";
import { ResponsiveBar } from "@nivo/bar";

function BarGraph(props) {
    // create array dict
    const data = props.listNbTweetsSentiment.map((x) => {
        return {
            ["sentiment"]: x.id,
            [x.id]: x.value,
        };
    });

    const MyResponsiveBar = (data) => (
        <ResponsiveBar
            data={data}
            keys={["Negative", "Neutral", "Positive"]}
            indexBy={"sentiment"}
            ariaLabel="Nivo bar chart demo"
            margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            borderRadius={4}
            valueScale={{ type: "linear" }}
            colors={["red", "yellow", "green"]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            motionConfig="molasses"
            labelTextColor="white"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: "Sentiments",
                legendPosition: "middle",
                legendOffset: 40,
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                tickColor: "red",
                legend: "Number of tweets",
                legendPosition: "middle",
                legendOffset: -50,
            }}
            theme={{
                fontSize: "14px",
                axis: {
                    tickColor: "White",
                    ticks: {
                        line: {
                            stroke: "grey",
                        },
                        text: {
                            fill: "white",
                        },
                    },
                    legend: {
                        text: {
                            fill: "grey",
                        },
                    },
                },
            }}
            tooltip={({ id, value }) => (
                <div
                    style={{
                        padding: 12,
                        color: "white",
                        background: "#222222",
                        borderRadius: 3,
                    }}
                >
                    <span>{id} tweets: </span>
                    <br />
                    <strong>{value}</strong>
                </div>
            )}
            defs={props.defsCharts}
            // 2. defining rules to apply those gradients
            fill={[
                // match using object query
                { match: { id: "Negative" }, id: "gradientNega" },
                { match: { id: "Neutral" }, id: "gradientNeut" },
                { match: { id: "Positive" }, id: "gradientPosi" },
            ]}
        />
    );
    return (
        <div className="bar-charts">
            <h4>Number of tweets by sentiment</h4>
            {MyResponsiveBar(data)}
        </div>
    );
}

export default BarGraph;
