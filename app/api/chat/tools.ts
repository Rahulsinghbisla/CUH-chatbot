import { tool, ToolRuntime } from "@langchain/core/tools";
import { z } from "zod"

const { getJson } = require("serpapi");

type listItemFromAPI = {
    video_id: string,
    link:string,
    title: string,
    channel: {
        name: string,
    }
    views: number,
    thumbnail: {
        static:string
    },
    length: string
}

type itemList = {
    video_id: string,
    link:string,
    title: string,
    channelName: string,
    views: number,
    thumbnail: string,
    length: string
}

export const getSearchYoutube = tool(
    async ({ query }) => {
        try {
            const response = await getJson({
                engine: "youtube",
                search_query: query,
                api_key: process.env.SERP_API_KEY
            });

            if (!response.video_results || response.video_results.length === 0) {
                return {
                    query,
                    itemList: [],
                }
            }

            const list = response.video_results
            .slice(0,6)
            .map((product: listItemFromAPI, index: number): itemList => {
                return {
                    video_id: product.video_id,
                    link:product.link,
                    title: product.title,
                    channelName: product.channel.name,
                    views: product.views,
                    thumbnail: product.thumbnail.static,
                    length: product.length
                }
            })
             console.log(
                "In the tools and calling successfully and list is : ",list
            )

            return {
                query,
                list,
            }
        } catch (error) {
            console.error("Some error is occurred while fetching ", error)
            return {
                query,
                itemList: [],
            }
        }

    },
    {
        name: "getSearchYoutube",
        description: "This tools helps to search on youtube like if user ask eg if user ask some sad song name on youtube then it will call and fetch the name on youtube>Note that only call if user explicitly say too search on the Youtube",
        schema: z.object({
            query: z.string(),
        }),
    }
);