
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	outputDir: './test-results',
	fullyParallel: true,
	globalSetup: './global-setup.js',
	use: {
		baseURL: 'http://127.0.0.1:3000',
	},
	webServer: {
		command: 'npm run test:e2eserver',
		url: 'http://127.0.0.1:3000/ready',
		reuseExistingServer: false,
		stdout: 'ignore',
		stderr: 'pipe',
		timeout: 5000
	},
	projects: [
		{
			name: 'node-turbo e2e tests',
			use: { ...devices['Desktop Safari'] }
		}
	]
});
