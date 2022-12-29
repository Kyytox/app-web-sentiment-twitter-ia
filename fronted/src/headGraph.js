import React from "react";
import verifBadge from "./image/icons8-verified-badge-48.png";

import "./App.css";

function HeadGraphs(props) {
    console.log("test", props.user);

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    let dateUnix = Date.parse(props.user.created_at);
    let dateCreateAt = new Date(dateUnix).toLocaleDateString("en-US", options);

    return (
        <div className="head-main-charts">
            <div className="head-title">
                <h2>Sentiment Analysis</h2>
            </div>

            <div className="div-profile-infos">
                <div className="head-profile">
                    <img src={props.user.profile_image_url} alt="Profil"></img>
                    <div className="profile-title">
                        <h3>
                            @{props.user.name}
                            {props.user.verified === false ? <p></p> : <img src={verifBadge} alt="badge"></img>}
                        </h3>
                        <a href={props.user.url} target="_blank" rel="noreferrer">
                            Official Link
                        </a>
                    </div>
                </div>

                <div className="profile-infos">
                    <p className="p-description">{props.user.description}</p>

                    <div className="profil-infos-loc">
                        <p className="p-location">Location : {props.user.location}</p>
                        <p className="p-create">Created : {dateCreateAt}</p>
                    </div>

                    <div className="profile-publics-metrics">
                        <p className="p-tweet-count">
                            <strong>{props.user.public_metrics.tweet_count}</strong> Tweets
                        </p>
                        <p className="p-following-count">
                            <strong>{props.user.public_metrics.following_count}</strong> subscriptions
                        </p>
                        <p className="p-followers-count">
                            <strong>{props.user.public_metrics.followers_count}</strong> subscribers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HeadGraphs;
