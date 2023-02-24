import { NextApiRequest, NextApiResponse } from 'next';
import arxiv from 'arxiv-api';
import moment from 'moment-timezone';

type Papers = {
  id: string
  title: string
  summary: string
  published: string
}

export const config = {
  runtime: 'nodejs',
}

function constructSlackPayload(papers: Papers[]) {
  const papersPayload = papers.map(({ id, title, summary, published }) => {
    const paper = {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*\n\n${summary}\n\nPublished on: ${moment(published.split('T')[0], "YYYY-MM-DD").format('MMMM Do, YYYY')}\n${id}`
      },
    }

    return paper
  })

  const completePayload = {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*arXiv digest for ${moment().tz("America/Los_Angeles").format('dddd, MMMM Do')}*`
        }
      },
      {
        "type": "divider"
      },
      ...papersPayload
    ]
  }
  return completePayload
}


export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const papers = await arxiv.search({
    searchQueryParams: [
      {
        include: [{ name: 'LLM' }],
      }
    ],
    start: 0,
    maxResults: 5,
    sortBy: 'submittedDate',
    sortOrder: 'descending'
  });

  const response = await fetch(process.env.SLACK_WEBHOOK_URL ?? '', {
    method: 'POST',
    body: JSON.stringify(constructSlackPayload(papers))
  })

  res.status(200).json({
    body: response
  });
}