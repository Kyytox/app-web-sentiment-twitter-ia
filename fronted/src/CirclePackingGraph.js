import React from "react";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";

function CirclePackingGraph(props) {
    // create array dict
    const data = props.listNbInteractionsCircular;

    const MyResponsiveCirclePacking = (data) => (
        <ResponsiveCirclePacking
            data={data}
            margin={{ top: 0, right: 0, bottom: 20, left: 20 }}
            id="name"
            value="loc"
            colors={["transparent", "red", "yellow", "green", "#ff54cb", "#626bff", "#088300", "#6cfeff"]}
            colorBy={"id"}
            label={"value"}
            padding={3}
            enableLabels={true}
            labelsFilter={function (n) {
                return 2 === n.node.depth;
            }}
            theme={{ fontSize: "12px" }}
            labelsSkipRadius={10}
            labelTextColor="white"
            defs={props.defsCharts}
            // 2. defining rules to apply those gradients
            fill={[
                // match using object query
                { match: { id: "Negative" }, id: "gradientNega" },
                { match: { id: "Neutral" }, id: "gradientNeut" },
                { match: { id: "Positive" }, id: "gradientPosi" },
                { match: { id: "Likes" }, id: "gradientLikes" },
                { match: { id: "Replies" }, id: "gradientReply" },
                { match: { id: "Retweets" }, id: "gradientRetweet" },
                { match: { id: "Quotes" }, id: "gradientQuote" },
            ]}
        />
    );
    return <div className="circular-charts">{MyResponsiveCirclePacking(data)}</div>;
}

export default CirclePackingGraph;
