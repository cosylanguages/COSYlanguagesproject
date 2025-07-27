import React, { useState, useEffect, useMemo } from 'react';
import './PricingPage.css';

const PricingPage = () => {
    const [language, setLanguage] = useState('english');
    const [pkg, setPkg] = useState('standard');
    const [duration, setDuration] = useState('15');
    const [quantity, setQuantity] = useState(1);
    const [totalEUR, setTotalEUR] = useState(0);
    const [originalTotalEUR, setOriginalTotalEUR] = useState(0);

    const priceData = useMemo(() => ({
        english: {
            standard: {15: 5, 30: 10, 50: 20, 80: 30, 110: 40},
            start: {15: 38, 30: 76, 50: 152, 80: 228, 110: 304},
            progress: {15: 72, 30: 144, 50: 288, 80: 432, 110: 576},
            maestro: {15: 136, 30: 272, 50: 544, 80: 816, 110: 1088}
        },
        french: {
            standard: {15: 10, 30: 15, 50: 25, 80: 35, 110: 45},
            start: {15: 76, 30: 116, 50: 180, 80: 266, 110: 242},
            progress: {15: 144, 30: 126, 50: 360, 80: 504, 110: 468},
            maestro: {15: 272, 30: 680, 50: 650, 80: 532, 110: 124}
        },
        italian: {
            standard: {15: 10, 30: 15, 50: 25, 80: 35, 110: 45},
            start: {15: 76, 30: 114, 50: 190, 80: 266, 110: 342},
            progress: {15: 144, 30: 216, 50: 360, 80: 504, 110: 648},
            maestro: {15: 272, 30: 408, 50: 680, 80: 952, 110: 1224}
        }
    }), []);

    const packageDiscounts = {
        standard: 0,
        start: 5,
        progress: 10,
        maestro: 15
    };

    const exchangeRates = {
        usd: 1.08,
        rub: 100.50
    };

    useEffect(() => {
        const calculatePrice = () => {
            const pricePerPackage = priceData[language][pkg][duration];
            const total = pricePerPackage * quantity;
            setTotalEUR(total);

            let originalTotal = total;
            if (pkg !== 'standard') {
                const standardPrice = priceData[language]['standard'][duration];
                const lessonsInPackage = pkg === 'start' ? 8 : pkg === 'progress' ? 16 : 32;
                originalTotal = (standardPrice * lessonsInPackage * quantity);
            }
            setOriginalTotalEUR(originalTotal);
        };

        calculatePrice();
    }, [language, pkg, duration, quantity, priceData]);

    const discount = packageDiscounts[pkg];

    const packageNames = {
        standard: "Standard",
        start: "Start",
        progress: "Progress",
        maestro: "Maestro"
    };

    const languageNames = {
        english: "English",
        french: "French",
        italian: "Italian"
    };

    const durationNames = {
        15: "15 min Conversation",
        30: "30 min Conversation",
        50: "50 min Basic",
        80: "80 min Basic/Exams",
        110: "110 min Exams"
    };

    const lessonsInPackage = pkg === 'standard' ? 1 :
                             pkg === 'start' ? 8 :
                             pkg === 'progress' ? 16 : 32;

    const courseDetailsText = `${quantity} × ${packageNames[pkg]} (${lessonsInPackage} lessons) - ${languageNames[language]} ${durationNames[duration]}`;

    return (
        <div className="compact-container">
            <header>
                <h1>COSY LANGUAGES</h1>
            </header>

            <div className="main-grid">
                <div className="calculator-section">
                    <h2><i className="fas fa-calculator"></i>CALCULATOR</h2>

                    <div className="form-group">
                        <label>Language</label>
                        <select id="language" value={language} onChange={e => setLanguage(e.target.value)}>
                            <option value="english">English</option>
                            <option value="french">French</option>
                            <option value="italian">Italian</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Package</label>
                        <select id="package" value={pkg} onChange={e => setPkg(e.target.value)}>
                            <option value="standard">Standard (1 lesson)</option>
                            <option value="start">Start (8 lessons)</option>
                            <option value="progress">Progress (16 lessons)</option>
                            <option value="maestro">Maestro (32 lessons)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Duration</label>
                        <select id="duration" value={duration} onChange={e => setDuration(e.target.value)}>
                            <option value="15">15 min (Conversation)</option>
                            <option value="30">30 min (Conversation)</option>
                            <option value="50">50 min (Basic)</option>
                            <option value="80">80 min (Basic/Exams)</option>
                            <option value="110">110 min (Exams)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Quantity</label>
                        <input type="number" id="quantity" min="1" value={quantity} onChange={e => setQuantity(parseInt(e.target.value, 10))} />
                    </div>

                    <div className="result-box">
                        <h2><i className="fas fa-receipt"></i>YOUR TOTAL</h2>
                        <div>
                            {pkg !== 'standard' && (
                                <span className="original-price" id="originalPrice">€{originalTotalEUR.toFixed(2)}</span>
                            )}
                            <span className="price" id="totalPrice">€{totalEUR.toFixed(2)}</span>
                            {pkg !== 'standard' && (
                                <span className="discount-badge" id="discountBadge">{discount}% OFF</span>
                            )}
                        </div>
                        <div className="details" id="courseDetails">{courseDetailsText}</div>
                    </div>

                    <h2><i className="fas fa-exchange-alt"></i>CURRENCY</h2>
                    <div className="conversion">
                        <div className="currency-box">
                            <div className="currency-flag">🇪🇺</div>
                            <div className="currency-name">EURO</div>
                            <div className="currency-value" id="eurValue">€{totalEUR.toFixed(2)}</div>
                        </div>
                        <div className="currency-box">
                            <div className="currency-flag">🇺🇸</div>
                            <div className="currency-name">DOLLAR</div>
                            <div className="currency-value" id="usdValue">${(totalEUR * exchangeRates.usd).toFixed(2)}</div>
                        </div>
                        <div className="currency-box">
                            <div className="currency-flag">🇷🇺</div>
                            <div className="currency-name">RUBLE</div>
                            <div className="currency-value" id="rubValue">₽{(totalEUR * exchangeRates.rub).toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <div className="pricing-section">
                    <h2><i className="fas fa-euro-sign"></i>PRICING</h2>

                    <div className="pricing-card">
                        <h3>STANDARD (1 lesson)</h3>
                        <ul>
                            <li><span>15 min</span> <span>€10</span></li>
                            <li><span>30 min</span> <span>€15</span></li>
                            <li><span>50 min</span> <span>€25</span></li>
                            <li><span>80 min</span> <span>€35</span></li>
                            <li><span>110 min</span> <span>€45</span></li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>START (8 lessons, 5% off)</h3>
                        <ul>
                            <li><span>15 min</span> <span>€76</span></li>
                            <li><span>30 min</span> <span>€116</span></li>
                            <li><span>50 min</span> <span>€180</span></li>
                            <li><span>80 min</span> <span>€266</span></li>
                            <li><span>110 min</span> <span>€242</span></li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>PROGRESS (16 lessons, 10% off)</h3>
                        <ul>
                            <li><span>15 min</span> <span>€144</span></li>
                            <li><span>30 min</span> <span>€126</span></li>
                            <li><span>50 min</span> <span>€360</span></li>
                            <li><span>80 min</span> <span>€504</span></li>
                            <li><span>110 min</span> <span>€468</span></li>
                        </ul>
                    </div>

                    <div className="pricing-card">
                        <h3>MAESTRO (32 lessons, 15% off)</h3>
                        <ul>
                            <li><span>15 min</span> <span>€272</span></li>
                            <li><span>30 min</span> <span>€680</span></li>
                            <li><span>50 min</span> <span>€650</span></li>
                            <li><span>80 min</span> <span>€532</span></li>
                            <li><span>110 min</span> <span>€124</span></li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer>
                <p>info@cosylanguages.com | +123 456 7890</p>
            </footer>
        </div>
    );
};

export default PricingPage;
