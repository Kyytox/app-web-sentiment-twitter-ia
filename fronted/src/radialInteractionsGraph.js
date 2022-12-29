import React from "react";
import { ResponsiveRadialBar } from "@nivo/radial-bar";

function RadialInteractionsGraph(props) {
    // create array dict
    const data = props.listNbInteractionsRadiant;

    const MyResponsiveRadialBar = (data) => (
        <ResponsiveRadialBar
            data={data}
            valueFormat=">-.02f"
            padding={0.25}
            cornerRadius={2}
            colors={["#b81984", "#1924b8", "#088300", "#19b8ac"]}
            margin={{ top: 80, right: 40, bottom: 40, left: 40 }}
            radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
            circularAxisOuter={{ tickSize: 5, tickPadding: 18, tickRotation: 0 }}
            enableCircularGrid={false}
            enableLabels={true}
            labelsSkipAngle={5}
            label={"value"}
            labelsTextColor={"white"}
            theme={{ fontSize: "13px", axis: { tickColor: "white", ticks: { text: { fill: "#9d9d9d" } } } }}
            legends={[
                {
                    anchor: "top-left",
                    direction: "column",
                    justify: false,
                    translateX: 40,
                    translateY: 40,
                    itemsSpacing: 6,
                    itemDirection: "left-to-right",
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemTextColor: "white",
                            },
                        },
                    ],
                },
            ]}
            defs={props.defsCharts}
            // 2. defining rules to apply those gradients
            fill={[
                // match using object query
                { match: { x: "Likes" }, id: "gradientLikes" },
                { match: { x: "Replies" }, id: "gradientReply" },
                { match: { x: "Retweets" }, id: "gradientRetweet" },
                { match: { x: "Quotes" }, id: "gradientQuote" },
            ]}
        />
    );
    return <div className="radiant-charts">{MyResponsiveRadialBar(data)}</div>;
}

export default RadialInteractionsGraph;
