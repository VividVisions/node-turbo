
import { resolve } from 'node:path';
import { readFile } from 'node:fs/promises';
import { green } from 'colorette';

// We're misusing Playwright's global setup functionality to log the 
// tested version of Hotwire Turbo, since test.beforeAll() can be called
// multiple times.
try {
	const
		filePath = resolve('./node_modules/@hotwired/turbo/package.json'),
		contents = await readFile(filePath, { encoding: 'utf8' }),
		pkg = JSON.parse(contents);

	console.log('–––––––––––––––––––––––––––––––––');
	console.log(`Testing node-turbo ${green(process.env.npm_package_version)} against Hotwire Turbo ${green(pkg.version)}.`);
	console.log('–––––––––––––––––––––––––––––––––');
}
catch(err) {
	throw err;
}

export default () => ({});
