/* ----------------------------------------------------
   ROBINHOOD INTERACTION CONTROLLER
   ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {

    /* ====================================================
       1. CUSTOM CURSOR & HOVER STATES
       ==================================================== */
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');

    if (cursor && cursorDot) {
        let cursorX = 0, cursorY = 0;
        let targetX = 0, targetY = 0;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            
            // Dot moves instantly
            cursorDot.style.left = `${targetX}px`;
            cursorDot.style.top = `${targetY}px`;
            cursorDot.style.opacity = '1';
            cursor.style.opacity = '1';
        });

        // Smooth trailing ring animation
        const renderCursor = () => {
            const ease = 0.15;
            cursorX += (targetX - cursorX) * ease;
            cursorY += (targetY - cursorY) * ease;

            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            requestAnimationFrame(renderCursor);
        };
        renderCursor();

        // Hover expansions
        const hoverables = document.querySelectorAll('a, button, .feature-item, .faq-trigger, .tab-btn');
        hoverables.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorDot.classList.add('hovered');
            });
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorDot.classList.remove('hovered');
            });
        });

        // Hide on leave window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
        });
    }

    /* ====================================================
       2. MOUSE PARALLAX ON ORBS
       ==================================================== */
    const orbs = [
        document.getElementById('orb1'),
        document.getElementById('orb2'),
        document.getElementById('orb3')
    ];

    document.addEventListener('mousemove', (e) => {
        const xPercent = (e.clientX / window.innerWidth) - 0.5;
        const yPercent = (e.clientY / window.innerHeight) - 0.5;

        orbs.forEach((orb, index) => {
            if (orb) {
                const multiplier = (index + 1) * 35;
                orb.style.transform = `translate(${xPercent * multiplier}px, ${yPercent * multiplier}px)`;
            }
        });
    });

    /* ====================================================
       3. STICKY NAVBAR & MOBILE MENU TOGGLE
       ==================================================== */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ====================================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER)
       ==================================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Unobserve after showing
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ====================================================
       5. BENEFIT CARD DIRECTIONAL GLOW TRACKING
       ==================================================== */
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    /* ====================================================
       6. HOW IT WORKS TIMELINE SCROLL PATH
       ==================================================== */
    const stepsSection = document.getElementById('steps');
    const progressBar = document.getElementById('timelineProgressBar');
    const stepCards = document.querySelectorAll('.step-card');

    const updateTimeline = () => {
        if (!stepsSection || !progressBar) return;

        const rect = stepsSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        // Calculate scroll ratio relative to the steps container viewport position
        const viewportHeight = window.innerHeight;
        const scrollStart = rect.top - viewportHeight / 2;
        const scrollEnd = scrollStart + sectionHeight - viewportHeight / 3;

        let progress = 0;
        if (rect.top <= viewportHeight / 2) {
            const totalScrollable = sectionHeight - viewportHeight / 3;
            const currentScroll = -scrollStart;
            progress = Math.min(Math.max((currentScroll / totalScrollable) * 100, 0), 100);
        }

        // Apply progress height/width based on layout orientation
        if (window.innerWidth > 1024) {
            progressBar.style.width = `${progress}%`;
            progressBar.style.height = '100%';
        } else {
            progressBar.style.height = `${progress}%`;
            progressBar.style.width = '100%';
        }

        // Active state bubbles/cards trigger
        stepCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            if (cardRect.top < viewportHeight / 1.8) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', updateTimeline);
    window.addEventListener('resize', updateTimeline);
    updateTimeline();

    /* ====================================================
       7. STATS NUMBERS COUNT-UP ANIMATION
       ==================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');

    const countUp = (element) => {
        const target = parseFloat(element.getAttribute('data-target'));
        const decimals = parseInt(element.getAttribute('data-decimals') || '0');
        const prefix = element.getAttribute('data-prefix') || '';
        const suffix = element.getAttribute('data-suffix') || '';
        const duration = 2000; // ms
        const stepTime = 16; // ~60fps
        const totalSteps = duration / stepTime;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            // Cubic easeOut progression
            const easeOutVal = 1 - Math.pow(1 - progress, 3);
            const currentVal = easeOutVal * target;

            element.textContent = prefix + currentVal.toFixed(decimals) + suffix;

            if (step >= totalSteps) {
                clearInterval(timer);
                element.textContent = prefix + target.toFixed(decimals) + suffix;
            }
        }, stepTime);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                if (!element.classList.contains('counted')) {
                    element.classList.add('counted');
                    countUp(element);
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));

    /* ====================================================
       8. HERO DYNAMIC PORTFOLIO TICKER FLUCTUATIONS & PARALLAX
       ==================================================== */
    const heroBalance = document.getElementById('heroBalanceValue');
    const heroProfit = document.getElementById('heroProfitBadge');
    const heroMockup = document.getElementById('heroMockup');

    if (heroBalance && heroProfit) {
        let baseBalance = 74892.40;
        let baseProfit = 12482.90;
        let basePercentage = 20.01;

        setInterval(() => {
            // Generate a random walk stock increment
            const change = (Math.random() - 0.48) * 12.5; // Slightly biased upwards
            baseBalance += change;
            baseProfit += change;
            
            // Re-calculate percentages
            const totalPrincipal = baseBalance - baseProfit;
            basePercentage = (baseProfit / totalPrincipal) * 100;

            // Formatted string
            heroBalance.textContent = `$${baseBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            
            const sign = baseProfit >= 0 ? '+' : '';
            const signPercent = basePercentage >= 0 ? '+' : '';
            heroProfit.querySelector('span').textContent = `${sign}$${baseProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${signPercent}${basePercentage.toFixed(2)}%)`;
            
            if (baseProfit >= 0) {
                heroProfit.className = 'profit-badge positive';
            } else {
                heroProfit.className = 'profit-badge negative';
            }
        }, 2500);
    }

    if (heroMockup) {
        document.addEventListener('mousemove', (e) => {
            const rect = heroMockup.getBoundingClientRect();
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
                const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

                heroMockup.style.transform = `rotateY(${deltaX * 6}deg) rotateX(${-deltaY * 4}deg) translateY(${-deltaY * 3}px)`;
            }
        });
        heroMockup.addEventListener('mouseleave', () => {
            heroMockup.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
        });
    }

    /* ====================================================
       8B. STICKY CTA SCROLL TRIGGER
       ==================================================== */
    const stickyCta = document.getElementById('stickyCtaBar');
    const heroSection = document.getElementById('hero');

    if (stickyCta && heroSection) {
        window.addEventListener('scroll', () => {
            const heroRect = heroSection.getBoundingClientRect();
            // Show sticky CTA once user scrolls past 60% of Hero height
            if (heroRect.bottom < heroRect.height * 0.4) {
                stickyCta.classList.add('active');
            } else {
                stickyCta.classList.remove('active');
            }
        });
    }

    /* ====================================================
       8C. PHONE LEAD CAPTURE & CONVERSION FEEDBACK
       ==================================================== */
    const leadForms = document.querySelectorAll('#heroLeadForm, #stickyLeadForm, #finalLeadForm');
    leadForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneInput = form.querySelector('.phone-input');
            const countrySelect = form.querySelector('.country-select');
            const submitBtn = form.querySelector('.lead-submit');

            if (!phoneInput || !submitBtn) return;

            const phoneNumber = phoneInput.value.trim();
            const countryCode = countrySelect ? countrySelect.value : '+1';

            // Basic check for digits length
            const digitCount = phoneNumber.replace(/\D/g, '').length;
            if (digitCount < 7) {
                phoneInput.style.borderColor = '#FF4F4F';
                phoneInput.focus();
                return;
            }

            // Visual Processing state
            phoneInput.style.borderColor = '';
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Processing...';
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                submitBtn.textContent = '✓ Connected';
                submitBtn.style.backgroundColor = '#8AFF00';
                submitBtn.style.color = '#050505';

                // Clear form inputs
                phoneInput.value = '';

                // Show conversion success notification
                const toast = document.createElement('div');
                toast.className = 'conversion-toast';
                toast.innerHTML = `
                    <div class="toast-content">
                        <span class="toast-icon">🚀</span>
                        <div class="toast-text">
                            <strong>Success!</strong>
                            <span>Investing guide sent to ${countryCode} ${phoneNumber}</span>
                        </div>
                    </div>
                `;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.classList.add('active');
                }, 100);

                setTimeout(() => {
                    toast.classList.remove('active');
                    setTimeout(() => toast.remove(), 500);
                }, 4000);

                // Restore button
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.style.pointerEvents = '';
                    submitBtn.style.opacity = '';
                }, 2500);

            }, 1200);
        });
    });

    /* ====================================================
       9. SHOWCASE INTERACTIVE CHART & TAB SYSTEM
       ==================================================== */
    const showcaseTabs = document.getElementById('showcaseTabs');
    const showcaseBalance = document.getElementById('showcaseBalanceValue');
    const showcaseProfit = document.getElementById('showcaseProfitText');
    const showcaseProfitBadge = document.getElementById('showcaseProfitBadge');
    
    const showcaseChartLine = document.getElementById('showcaseChartLine');
    const showcaseChartArea = document.getElementById('showcaseChartArea');
    const showcaseChart = document.getElementById('showcaseChart');
    
    const hoverLine = document.getElementById('chartHoverLine');
    const hoverDot = document.getElementById('chartHoverDot');
    const tooltip = document.getElementById('chartTooltip');

    // Chart Timeframe coordinates and display values
    const chartData = {
        '1D': {
            balance: '$143,584.22',
            profit: '+$2,490.50 (+1.76%)',
            positive: true,
            coords: [240, 250, 220, 230, 210, 225, 205, 190, 200, 180, 195, 185, 170, 180, 160, 140, 150, 130, 145, 120]
        },
        '1W': {
            balance: '$141,230.12',
            profit: '+$5,892.40 (+4.35%)',
            positive: true,
            coords: [260, 270, 250, 230, 240, 220, 190, 210, 180, 190, 160, 175, 150, 130, 110, 120]
        },
        '1M': {
            balance: '$139,482.90',
            profit: '+$14,249.20 (+11.38%)',
            positive: true,
            coords: [280, 270, 290, 260, 240, 250, 220, 230, 200, 210, 190, 170, 180, 150, 160, 130, 140, 110, 95]
        },
        '3M': {
            balance: '$126,892.45',
            profit: '-$8,490.10 (-6.27%)',
            positive: false,
            coords: [90, 110, 130, 120, 140, 160, 150, 180, 200, 190, 210, 230, 220, 245, 250, 260, 240, 255, 270, 280]
        },
        '1Y': {
            balance: '$143,584.22',
            profit: '+$28,490.50 (+24.75%)',
            positive: true,
            coords: [270, 280, 290, 275, 255, 240, 260, 220, 205, 190, 210, 180, 165, 140, 155, 125, 110, 90, 100, 70, 60]
        },
        'ALL': {
            balance: '$143,584.22',
            profit: '+$94,892.40 (+194.88%)',
            positive: true,
            coords: [295, 285, 290, 260, 270, 240, 230, 250, 210, 190, 200, 170, 150, 160, 120, 130, 90, 100, 70, 80, 50, 40]
        }
    };

    let activeData = chartData['1Y']; // default
    let calculatedPoints = []; // To store mapped coordinates for crosshair tracking

    const renderSVGChart = (data) => {
        const width = 800;
        const height = 300;
        const coords = data.coords;
        const numPoints = coords.length;
        const stepX = width / (numPoints - 1);
        
        calculatedPoints = []; // reset
        
        let pathLine = '';
        coords.forEach((y, i) => {
            const x = i * stepX;
            calculatedPoints.push({ x, y });
            if (i === 0) {
                pathLine += `M ${x} ${y}`;
            } else {
                pathLine += ` L ${x} ${y}`;
            }
        });

        // Set attributes
        showcaseChartLine.setAttribute('d', pathLine);
        
        const pathArea = `${pathLine} L ${width} ${height} L 0 ${height} Z`;
        showcaseChartArea.setAttribute('d', pathArea);

        // Color update based on positive/negative
        const color = data.positive ? '#8AFF00' : '#FF4F4F';
        const glowColor = data.positive ? 'rgba(138, 255, 0, 0.2)' : 'rgba(255, 79, 79, 0.2)';
        
        showcaseChartLine.setAttribute('stroke', color);
        
        // Update gradient color tokens
        const gradient = document.getElementById('showcaseChartGradient');
        if (gradient) {
            gradient.querySelector('stop[offset="0%"]').setAttribute('stop-color', color);
            gradient.querySelector('stop[offset="0%"]').setAttribute('stop-opacity', '0.2');
        }

        hoverDot.setAttribute('fill', color);
        
        // Re-run SVG draw animation
        showcaseChartLine.style.animation = 'none';
        showcaseChartLine.offsetHeight; // trigger reflow
        showcaseChartLine.style.animation = 'drawLine 1s forwards ease-out';
    };

    // Tab button selection logic
    if (showcaseTabs) {
        showcaseTabs.addEventListener('click', (e) => {
            const button = e.target.closest('.tab-btn');
            if (!button) return;

            // Remove active classes
            showcaseTabs.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const timeframe = button.getAttribute('data-time');
            activeData = chartData[timeframe];

            // Render details
            showcaseBalance.textContent = activeData.balance;
            showcaseProfit.textContent = activeData.profit;
            
            if (activeData.positive) {
                showcaseProfitBadge.className = 'profit-badge positive';
            } else {
                showcaseProfitBadge.className = 'profit-badge negative';
            }

            renderSVGChart(activeData);
            
            // Hide tooltip
            hoverLine.style.display = 'none';
            hoverDot.style.display = 'none';
            tooltip.style.display = 'none';
        });
    }

    // Initialize Showcase chart
    if (showcaseChart) {
        renderSVGChart(activeData);

        /* ====================================================
           9B. CHART TOOLTIP & CROSSHAIR INTERACTION
           ==================================================== */
        showcaseChart.addEventListener('mousemove', (e) => {
            const rect = showcaseChart.getBoundingClientRect();
            const width = rect.width;
            
            // Compute coordinate scaling ratios
            const svgWidth = 800;
            const svgHeight = 300;
            
            // Mouse X coordinate relative to the SVG viewbox
            const scaleX = svgWidth / width;
            const mouseX = (e.clientX - rect.left) * scaleX;

            // Find nearest calculated data point coordinate
            let closestPoint = calculatedPoints[0];
            let minDiff = Math.abs(mouseX - closestPoint.x);

            for (let i = 1; i < calculatedPoints.length; i++) {
                const diff = Math.abs(mouseX - calculatedPoints[i].x);
                if (diff < minDiff) {
                    minDiff = diff;
                    closestPoint = calculatedPoints[i];
                }
            }

            // Map viewport position of the closest coordinate point
            const viewX = closestPoint.x / scaleX;
            const viewY = closestPoint.y * (rect.height / svgHeight);

            // Display Crosshairs
            hoverLine.style.display = 'block';
            hoverLine.setAttribute('x1', closestPoint.x);
            hoverLine.setAttribute('x2', closestPoint.x);

            hoverDot.style.display = 'block';
            hoverDot.setAttribute('cx', closestPoint.x);
            hoverDot.setAttribute('cy', closestPoint.y);

            // Calculate mock fluctuating dollar amount based on Y coordinate height
            const balanceNum = parseFloat(activeData.balance.replace(/[^0-9.]/g, ''));
            // Standard variance offset based on line height ratio
            const minHeightY = Math.min(...activeData.coords);
            const maxHeightY = Math.max(...activeData.coords);
            const yRange = maxHeightY - minHeightY;
            const relativeOffsetRatio = (closestPoint.y - minHeightY) / yRange;
            
            // Compute relative balance value at dot
            const hoveredValue = balanceNum * (1 - (relativeOffsetRatio * 0.05));

            tooltip.style.display = 'block';
            tooltip.textContent = `$${hoveredValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            tooltip.style.left = `${viewX}px`;
            tooltip.style.top = `${viewY - 12}px`;
            
            // Showcase balance header follows cursor values
            showcaseBalance.textContent = `$${hoveredValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        });

        // Mouse leaves chart -> restores original stats
        showcaseChart.addEventListener('mouseleave', () => {
            hoverLine.style.display = 'none';
            hoverDot.style.display = 'none';
            tooltip.style.display = 'none';
            
            showcaseBalance.textContent = activeData.balance;
        });
    }

    // Side Showcase features bullets triggers
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active classes
            featureItems.forEach(f => f.classList.remove('active'));
            item.classList.add('active');

            // Force tab button select corresponding to bullet click
            const index = parseInt(item.getAttribute('data-target'));
            const tabButtons = document.querySelectorAll('#showcaseTabs .tab-btn');
            if (tabButtons[index]) {
                tabButtons[index].click();
            }
        });
    });

    /* ====================================================
       10. FAQ ACCORDION TOGGLE MECHANISM
       ==================================================== */
    const faqTriggers = document.querySelectorAll('.faq-trigger');

    faqTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentElement;
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Collapse other items
            document.querySelectorAll('.faq-item').forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
            });

            // Expand active
            if (!isExpanded) {
                item.classList.add('active');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* ====================================================
       11. MAGNETIC BUTTON STYLING EFFECTS
       ==================================================== */
    const magneticBtns = document.querySelectorAll('.btn-magnetic');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            // Calculate center of button
            const btnX = rect.left + rect.width / 2;
            const btnY = rect.top + rect.height / 2;

            // Calculate distance to cursor
            const deltaX = e.clientX - btnX;
            const deltaY = e.clientY - btnY;

            // Translate vector scale
            const pullStrength = 0.35;
            btn.style.transform = `translate3d(${deltaX * pullStrength}px, ${deltaY * pullStrength}px, 0)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0, 0, 0)';
        });
    });

    /* ====================================================
       12. NEWSLETTER FORM ACTION RESPONSE
       ==================================================== */
    const newsletterForm = document.getElementById('newsletterForm');
    const successMsg = document.getElementById('newsletterSuccess');

    if (newsletterForm && successMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show Success Msg
            successMsg.style.display = 'block';
            newsletterForm.reset();
            
            // Fade out success message after 4 seconds
            setTimeout(() => {
                successMsg.style.opacity = '0';
                setTimeout(() => {
                    successMsg.style.display = 'none';
                    successMsg.style.opacity = '1';
                }, 500);
            }, 3500);
        });
    }

});
