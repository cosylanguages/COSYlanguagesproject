import React, { useState, useEffect } from 'react';
import './Calculator.css';
import { useI18n } from '../../i18n/I18nContext';
import StudyLayout from '../../components/Layout/StudyLayout';
import {
  priceData,
  packageDiscounts,
  exchangeRates,
  packageNames,
  languageNames,
  durationNames,
} from '../../data/calculatorData';

const Calculator = () => {
    const [pkg, setPkg] = useState('standard');
    const [duration, setDuration] = useState('15');
    const [quantity, setQuantity] = useState(1);
    const [totalEUR, setTotalEUR] = useState(0);
    const [originalTotalEUR, setOriginalTotalEUR] = useState(0);

    const { currentLangKey: languageInitial } = useI18n();
    const language = priceData.hasOwnProperty(languageInitial) ? languageInitial : 'english';

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
    }, [language, pkg, duration, quantity]);

    const discount = packageDiscounts[pkg];

    const lessonsInPackage = pkg === 'standard' ? 1 :
                             pkg === 'start' ? 8 :
                             pkg === 'progress' ? 16 : 32;

    const courseDetailsText = `${quantity} × ${packageNames[pkg]} (${lessonsInPackage} lessons) - ${languageNames[language]} ${durationNames[duration]}`;

    return (
        <StudyLayout>
            <div className="study-card">
                <div className="calculator-section">
                    <h2><i className="fas fa-calculator"></i>CALCULATOR</h2>


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
            </div>
        </StudyLayout>
    );
};

export default Calculator;
