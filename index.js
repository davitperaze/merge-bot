const core = require('@actions/core');
const github = require('@actions/github');

async function run() {
    try {
        const nameToGreet = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);

        const time = (new Date()).toDateString();
        core.setOutput('time', time);

        const payload = JSON.stringify(github.context.payload, undefined, 2);
        console.log(`The event payload: ${payload}`);

        // create a GitHub client
        const token = core.getInput('GITHUB_TOKEN');
        const octokit = new github.GitHub(token);

        // get requested reviewer list
        const reviewers = await octokit.pulls.listReviews({
            owner: github.context.payload.pull_request.user.login,
            repo: github.context.payload.repository.name,
            pull_number: github.context.payload.number
        });

        console.log(`Reviewers: ${JSON.stringify(reviewers)}`);

        const labels = octokit.issues.listLabelsOnIssue({
            owner: github.context.payload.pull_request.user.login,
            repo: github.context.payload.repository.name,
            issue_number: github.context.payload.number
        });

        console.log(`Labels: ${JSON.stringify(labels)}`);

        await octokit.issues.createComment({
            owner: 'squalrus',
            repo: github.context.payload.repository.name,
            issue_number: github.context.payload.number,
            body: `howdy: ${github.context.payload.label.name}`
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
