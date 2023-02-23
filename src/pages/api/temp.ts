// import arxiv from 'arxiv-api';

function constructPayload(title, authors, summary, link) {
  return {
    // TODO: construct payload Slack format
    text: title,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: title,
        },
      },
    ],
  };
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.json();
}

export default {
  async cron(cron: Repeat.Cron, env: Repeat.Env): Promise<void> {
    try {
      console.log('running cron job');
      // const papers = await arxiv.search({
      // 	searchQueryParams: [
      // 		{
      // 			include: [{ name: 'RNN' }, { name: 'Deep learning' }],
      // 			exclude: [{ name: 'LSTM' }],
      // 		},
      // 		{
      // 			include: [{ name: 'GAN' }],
      // 		},
      // 	],
      // 	start: 0,
      // 	maxResults: 10,
      // });
      // console.log(papers);

      // write cron task here
      // const payload = constructPayload('Repeat test', '', '', '');
      // postData('https://hooks.slack.com/services/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', payload).then(
      // 	data => {
      // 		console.log(data);
      // 	}
      // );

      env.metrics.write('cron_processed', 1, 'success');
    } catch (e) {
      console.error('cron failed!', e.message);
      env.metrics.write('cron_processed', 1, 'failure');
    }
  },
};
