import os
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Listen for all console events and handle them
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    # Go to the local http server
    page.goto("http://localhost:8080")

    # Check that the title is correct
    expect(page).to_have_title("COSYlanguages")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
