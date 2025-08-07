from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Go to the login page to set up the session storage
        page.goto("http://localhost:3000/login")

        # Simulate a logged-in user by setting session storage
        page.evaluate("""() => {
            sessionStorage.setItem('authToken', 'fake-auth-token');
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: 'testuser',
                role: 'user'
            }));
        }""")

        # Navigate to the home page, which should now show the dashboard
        page.goto("http://localhost:3000/")

        # Wait for the dashboard to load
        page.wait_for_selector('.dashboard-page')

        page.screenshot(path="jules-scratch/verification/verification.png")
        browser.close()

run()
