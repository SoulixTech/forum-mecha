const containerEl = document.querySelector('.container');
const checkboxEl = document.querySelector('.form-container .form-row input[type="checkbox"]');
const nameEl = document.querySelector('.form-container .form-row input[name="name"]');
const emailEl = document.querySelector('.form-container .form-row input[name="email"]');
const mobileEl = document.querySelector('.form-container .form-row input[name="mobile"]');
const yearEl = document.querySelector('.form-container .form-row input[name="year"]');
const departmentEl = document.querySelector('.form-container .form-row input[name="department"]');
const submitBtn = document.querySelector('.form-container .form-row input[type="submit"]');

const sprayer = document.querySelector('.sprayer');
const sprayHandContainer = document.querySelector('.spray-hand-container');
const sprayLines = Array.from(document.querySelectorAll('.spray-line'));
const sprayBubbles = Array.from(document.querySelectorAll('.spray-bubble'));

const pushingHand = document.querySelector('.pushing-hand');
const sprayerHead = document.querySelector('.sprayer-head');
const gearsContainer = document.querySelector('svg .gears');
const gearConnector = document.querySelector('.gear-connector');

const pullSystemContainer = document.querySelector('.pull-system');

const checkboxPullLine = document.querySelector('.checkbox-pull-line');
const checkboxPullCircle = document.querySelector('.checkbox-pull-circle');
const btnPullLine = document.querySelector('.submit-btn-connector');
const btnHandlerCircle = document.querySelector('.submit-btn-circle');

const spiralContainer = document.querySelector('.spiral-container');
const weightBigContainer = document.querySelector('.weight-big-container');

const scalesContainer = document.querySelector('.scales-container');
const scalesLine = document.querySelector('.scales-moving-line');
const weightBig = document.querySelector('.weight-big');
const spiralPath = document.querySelector('.spiral-path');

const carContainer = document.querySelector('.car-container');
const car = document.querySelector('.car');
const carInclineWrapper = document.querySelector('.car-container g');
const timingChains = Array.from(document.querySelectorAll('.timing-chain'));
const reelsConnector = document.querySelector('.reels-connector');
const carWeightConnector = document.querySelector('.car-weight-connector');

const grabbingHand = document.querySelectorAll('.grabbing-hand');
const grabbingHandOpenFingers = Array.from(document.querySelectorAll('.grabbing-hand-finger-open'));
const grabbingHandClosedFingers = Array.from(document.querySelectorAll('.grabbing-hand-finger-closed'));


layoutPreparation();
scaleToFit();
window.onresize = scaleToFit;

// Disable checkbox initially
checkboxEl.disabled = true;

function scaleToFit() {
    const h = 800;

    if (window.innerHeight < h) {
        gsap.set(containerEl, {
            scale: window.innerHeight / h,
            transformOrigin: "50% 75%"
        })
    }

}


let sprayRepeatCounter = 0;
const state = {
    handClosed: false,
    sumbitBtnOnPlace: false,
    sumbitBtnTextOpacity: 0,
    pullProgress: 0
}
let nameValid = false;
let emailValid = false;
let mobileValid = false;
let yearValid = false;
let departmentValid = false;

const emailTl = createEmailTl();
const mobileTl = createMobileTl();
const yearTl = createYearTl();
const departmentTl = createDepartmentTl();
const gearsTls = createGearsTimelines();
createPullingTimeline(state.handClosed, checkboxEl.checked);


checkboxEl.addEventListener('change', () => {
    createPullingTimeline(state.handClosed, checkboxEl.checked);
})

nameEl.addEventListener('input', () => {
    nameValid = nameEl.value.length > 3;
    if (nameValid) {
        nameEl.classList.add("valid");
        gearsTls.forEach(tl => {
            if (tl.paused()) {
                tl.play();
                gsap.fromTo(tl, {
                    timeScale: 0
                }, {
                    timeScale: 1
                })
            }
        })
    } else {
        nameEl.classList.remove("valid");
        gearsTls.forEach(tl => {
            if (!tl.paused()) {
                gsap.to(tl, {
                    timeScale: 0,
                    onComplete: () => {
                        tl.pause();
                    }
                })
            }
        })
        sprayRepeatCounter = 0;
        gsap.to(submitBtn, {
            duration: .3,
            color: "rgba(0, 0, 0, " + 0 + ")"
        })
    }
})

emailEl.addEventListener('input', () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    emailValid = emailRegex.test(emailEl.value);
    if (emailValid) {
        emailTl.play();
        emailEl.classList.add("valid");
    } else {
        emailTl.reverse();
        emailEl.classList.remove("valid");
    }
})

mobileEl.addEventListener('input', () => {
    // Only allow numbers
    mobileEl.value = mobileEl.value.replace(/[^0-9]/g, '');
    
    const mobileRegex = /^[0-9]{10}$/;
    mobileValid = mobileRegex.test(mobileEl.value);
    if (mobileValid) {
        mobileTl.play();
        mobileEl.classList.add("valid");
        // Enable checkbox when mobile is valid
        checkboxEl.disabled = false;
    } else {
        mobileTl.reverse();
        mobileEl.classList.remove("valid");
        // Disable and uncheck checkbox when mobile is invalid
        checkboxEl.disabled = true;
        if (checkboxEl.checked) {
            checkboxEl.checked = false;
            createPullingTimeline(state.handClosed, false);
        }
    }
})

yearEl.addEventListener('input', () => {
    const yearValue = yearEl.value.toLowerCase().trim();
    // Check if user typed valid year format (1st, 2nd, 3rd, 4th year)
    const validYears = ['1st year', '2nd year', '3rd year', '4th year', '1', '2', '3', '4'];
    yearValid = validYears.some(year => yearValue.includes(year));
    
    if (yearValid) {
        yearTl.play();
        yearEl.classList.add("valid");
    } else {
        yearTl.reverse();
        yearEl.classList.remove("valid");
    }
})

departmentEl.addEventListener('input', () => {
    const deptValue = departmentEl.value.toLowerCase().trim();
    // Check if user typed valid department
    const validDepts = ['data science', 'computer science', 'electrical', 'mechanical', 
                       'civil', 'electronics', 'information technology', 'it', 'cs', 'ds'];
    departmentValid = validDepts.some(dept => deptValue.includes(dept));
    
    if (departmentValid) {
        departmentTl.play();
        departmentEl.classList.add("valid");
    } else {
        departmentTl.reverse();
        departmentEl.classList.remove("valid");
    }
})

submitBtn.addEventListener('click', () => {
    if (emailValid && checkboxEl.checked && nameValid && mobileValid && yearValid && departmentValid && sprayRepeatCounter > 1) {
        gsap.to("svg > *", {
            duration: .1,
            opacity: 0,
            stagger: {
                each: 0.03,
                from: 'random',
                ease: 'none',
            }
        })
        gsap.to(".form-row", {
            delay: .4,
            duration: .1,
            opacity: 0,
            stagger: .1
        })
    }
})


function layoutPreparation() {
    gsap.set(pullSystemContainer, {
        x: 375,
        y: 646
    })
    gsap.set(sprayHandContainer, {
        x: 700,
        y: 621
    })
    gsap.set(sprayer, {
        x: -59.5,
        y: 53
    })
    gsap.set(carContainer, {
        x: 190,
        y: 802,
    })
    gsap.set(scalesContainer, {
        x: 170,
        y: 710,
    })
    gsap.set(grabbingHand, {
        x: 297,
        y: 830
    })
    gsap.set(grabbingHandClosedFingers, {
        opacity: 0
    })
    gsap.set(spiralContainer, {
        x: 305,
        y: 435,
        svgOrigin: "14 14",
        scaleX: -1,
    })
    gsap.set(weightBigContainer, {
        x: 305,
        y: 435,
    })
    gsap.set(submitBtn, {
        color: "rgba(0, 0, 0, " + 0 + ")"
    })
    gsap.set([sprayLines, sprayBubbles], {
        opacity: 0
    })
    gsap.set(timingChains[0], {
        attr: {
            "stroke-width": "5",
            "stroke-dasharray": "0 12",
        }
    })
    gsap.set(timingChains[1], {
        attr: {
            "stroke-width": "5",
            "stroke-dasharray": "0 12",
        }
    })
    gsap.set(checkboxPullLine, {
        attr: {
            y1: -105,
            y2: 44
        }
    });
    gsap.set(submitBtn, {
        transformOrigin: "100% 0%",
        rotation: -90
    })
    gsap.set(checkboxPullCircle, {
        y: 44
    });
}

function updateSpiralPath(centerX, centerY, radius, coils, points, offset) {
    let path = "";
    let thetaMax = coils * 2 * Math.PI;
    const awayStep = radius / thetaMax;
    const chord = 2 * Math.PI / points;
    thetaMax -= offset * points * chord;

    for (let theta = 0; theta <= thetaMax; theta += chord) {
        const away = awayStep * theta;
        const x = centerX + Math.cos(theta) * away;
        const y = centerY + Math.sin(theta) * away;

        if (theta === 0) {
            path += `M${x},${y}`;
        } else {
            const prevAway = awayStep * (theta - chord);
            const arcRadius = (away + prevAway) / 2;
            path += ` A${arcRadius},${arcRadius} 0 0,1 ${x},${y}`;
        }
    }

    const outerAngle = thetaMax + .5 * Math.PI;
    const outerLength = 50 + 25 * offset
    const endPoint = [
        Math.cos(outerAngle) * outerLength,
        Math.sin(outerAngle) * outerLength,
    ]
    path += (' l' + endPoint[0] + ',' + endPoint[1]);

    gsap.set(spiralPath, {
        attr: {
            d: path
        },
    })
    gsap.set(weightBig, {
        x: -47 + 3 * offset,
        y: 12 + outerLength
    })
}

function createEmailTl() {
    const spiralTurnsNumber = 8;
    const spiralProgress = {v: 0}
    const hammerTimeStart = 1.85;
    const fingersDelay = .5;
    const fingersTimeDelta = .03;
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            ease: "none",
            duration: 2
        },
        onUpdate: () => {
            updateSpiralPath(14, 14, 45, 17, 200, spiralTurnsNumber * spiralProgress.v);
        },
    })
        .to(spiralProgress, {
            v: 1
        }, 0)
        .to(spiralContainer, {
            rotation: -spiralTurnsNumber * 360,
        }, 0)

        .fromTo(scalesLine, {
            rotation: -20,
            svgOrigin: "92 20"
        }, {
            duration: .15,
            rotation: -1,
            svgOrigin: "92 20"
        }, hammerTimeStart)

        .fromTo(timingChains[0], {
            attr: {
                "stroke-dashoffset": 2
            }
        }, {
            duration: .15,
            attr: {
                "stroke-dashoffset": 20
            }
        }, hammerTimeStart)
        .fromTo(timingChains[1], {
            attr: {
                "stroke-dashoffset": 24
            }
        }, {
            duration: .15,
            attr: {
                "stroke-dashoffset": 6
            }
        }, hammerTimeStart)
        .to(reelsConnector, {
            duration: .15,
            y: 18
        }, hammerTimeStart)
        .to(carWeightConnector, {
            duration: .15,
            y: -18
        }, hammerTimeStart)
        .to(carInclineWrapper, {
            duration: .15,
            rotation: 6,
            svgOrigin: "120 93"
        }, hammerTimeStart)
        .fromTo(car, {
            x: -50,
        }, {
            duration: .6,
            x: 95,
            ease: "power2.in",
        }, hammerTimeStart)
    for (let i = 0; i < 5; i++) {
        tl
            .set(grabbingHandOpenFingers[i], {
                opacity: 0
            }, hammerTimeStart + fingersDelay + fingersTimeDelta * (i + 1))
            .set(grabbingHandClosedFingers[i], {
                opacity: 1
            }, hammerTimeStart + fingersDelay + fingersTimeDelta * (i + 1))
    }
    tl
        .fromTo(state, {
            handClosed: false
        }, {
            duration: .01,
            handClosed: true
        }, ">")
        .to(grabbingHand, {
            duration: fingersTimeDelta * 5,
            x: "+=20"
        }, hammerTimeStart + fingersDelay)

    tl.progress(0.001);

    return tl;
}

function createMobileTl() {
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            ease: "none",
            duration: 2
        }
    });

    // Create a rocket launch effect with the weight
    tl.to(weightBigContainer, {
        duration: 0.3,
        y: "+=20",
        ease: "power2.in"
    }, 0)
    .to(weightBigContainer, {
        duration: 1.2,
        y: "-=200",
        ease: "power2.out"
    }, 0.3)
    .to(weightBigContainer, {
        duration: 0.5,
        y: 435,
        ease: "bounce.out"
    }, 1.5);

    // Spin the spiral during launch
    tl.to(spiralContainer, {
        duration: 1.5,
        rotation: "+=720",
        ease: "power2.inOut"
    }, 0.3);

    // Make the gears spin backwards briefly
    const gearGroups = Array.from(document.querySelectorAll('.gears g'));
    gearGroups.forEach((gear, idx) => {
        tl.to(gear, {
            duration: 0.5,
            rotation: "-=180",
            ease: "back.inOut",
            transformOrigin: "center center"
        }, 0);
    });

    // Shake the entire scales system
    tl.to(scalesContainer, {
        duration: 0.05,
        x: 170 + 3,
        repeat: 15,
        yoyo: true,
        ease: "none"
    }, 0.3);

    // Wobble the car left and right
    tl.to(car, {
        duration: 0.1,
        rotation: -10,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center bottom"
    }, 0.3);

    tl.progress(0.001);

    return tl;
}

function createYearTl() {
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            ease: "none",
            duration: 2
        }
    });

    // Create a pendulum swing effect with the grabbing hand
    tl.to(grabbingHand, {
        duration: 0.8,
        rotation: 30,
        transformOrigin: "50% 0%",
        ease: "power2.inOut",
        repeat: 2,
        yoyo: true
    }, 0);

    // Make the spiral pulse and glow
    tl.to(spiralContainer, {
        duration: 0.2,
        scale: 1.15,
        repeat: 4,
        yoyo: true,
        ease: "power2.inOut",
        transformOrigin: "center center"
    }, 0);

    // Animate the scales line swinging
    tl.to(scalesLine, {
        duration: 0.4,
        rotation: 15,
        repeat: 3,
        yoyo: true,
        ease: "sine.inOut",
        svgOrigin: "40 12"
    }, 0);

    // Wobble the sprayer
    tl.to(sprayer, {
        duration: 0.15,
        rotation: 5,
        repeat: 8,
        yoyo: true,
        ease: "sine.inOut",
        transformOrigin: "center bottom"
    }, 0);

    // Move reels connector up and down
    tl.to(reelsConnector, {
        duration: 0.3,
        y: 12,
        repeat: 4,
        yoyo: true,
        ease: "power1.inOut"
    }, 0);

    tl.progress(0.001);

    return tl;
}

function createDepartmentTl() {
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            ease: "none",
            duration: 2.5
        }
    });

    // Create a wave effect - car drives back and forth
    tl.to(car, {
        duration: 0.6,
        x: -30,
        ease: "power2.inOut"
    }, 0)
    .to(car, {
        duration: 0.6,
        x: 30,
        ease: "power2.inOut"
    }, 0.6)
    .to(car, {
        duration: 0.6,
        x: 0,
        ease: "power2.inOut"
    }, 1.2);

    // Rotate the car incline wrapper
    tl.to(carInclineWrapper, {
        duration: 0.4,
        rotation: -8,
        repeat: 3,
        yoyo: true,
        ease: "sine.inOut",
        svgOrigin: "120 93"
    }, 0);

    // Make all gears spin in sync rapidly
    const gearGroups = Array.from(document.querySelectorAll('.gears g'));
    gearGroups.forEach((gear, idx) => {
        tl.to(gear, {
            duration: 1.8,
            rotation: idx % 2 === 0 ? "+=360" : "-=360",
            ease: "power2.inOut",
            transformOrigin: "center center"
        }, 0);
    });

    // Animate timing chains moving rapidly
    tl.to(timingChains[0], {
        duration: 0.1,
        attr: {
            "stroke-dashoffset": "+=4"
        },
        repeat: 18,
        ease: "none"
    }, 0);

    tl.to(timingChains[1], {
        duration: 0.1,
        attr: {
            "stroke-dashoffset": "-=4"
        },
        repeat: 18,
        ease: "none"
    }, 0);

    // Shake the pushing hand
    tl.to(pushingHand, {
        duration: 0.08,
        y: "+=3",
        repeat: 20,
        yoyo: true,
        ease: "none"
    }, 0);

    // Weight big bounces
    tl.to(weightBig, {
        duration: 0.3,
        y: -20,
        repeat: 5,
        yoyo: true,
        ease: "bounce.out"
    }, 0);

    tl.progress(0.001);

    return tl;
}

function createGearsTimelines() {
    const tls = []

    const params = {
        baseSize: 15,
        pitch: 11,
        teethCurve: .6,
        startPos: {x: 634, y: 389},
        speed: .2
    }
    const data = [{
        angle: 0, teethNumber: 10, hasHole: true
    }, {
        angle: -.5, teethNumber: 32, hasHole: true
    }, {
        angle: 1.65, teethNumber: 12, hasHole: false
    }];

    const handleRadius = 14;

    const gears = [];
    data.forEach((d, dIdx) => {

        const radius = (d.teethNumber * params.baseSize) / (2 * Math.PI);
        let x, y, startAngle;

        if (dIdx === 0) {
            startAngle = 0;
            x = params.startPos.x;
            y = params.startPos.y;
        } else {
            const parent = gears[dIdx - 1];

            const size = parent.teethNumber / d.teethNumber;

            x = parent.center.x + Math.cos(d.angle) * (parent.radius + radius);
            y = parent.center.y + Math.sin(d.angle) * (parent.radius + radius);

            startAngle = (1 + size) * d.angle - size * parent.angle;
        }


        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        gearsContainer.appendChild(group);
        group.appendChild(path);

        const gear = {
            idx: dIdx,
            center: {x, y},
            radius,
            angle: startAngle,
            teethNumber: d.teethNumber,
            hasHole: d.hasHole,
            toothAngle: 2 * Math.PI / d.teethNumber,
            toothCurveAngle: params.teethCurve / d.teethNumber,
            group
        }


        const rOut = gear.radius + .25 * params.pitch;
        const rIn = rOut - .75 * params.pitch;
        let pathD = "M" + (gear.center.x + Math.cos(gear.angle - gear.toothAngle + gear.toothCurveAngle) * rOut) + ", " + (gear.center.y + Math.sin(gear.angle - gear.toothAngle + gear.toothCurveAngle) * rOut) + " ";
        for (let a = gear.angle; a < (gear.angle + 2 * Math.PI - .5 * gear.toothAngle); a += gear.toothAngle) {
            const pa = (a - .5 * gear.toothAngle);
            pathD += ("L" + (gear.center.x + Math.cos(pa - gear.toothCurveAngle) * rOut) + ", " + (gear.center.y + Math.sin(pa - gear.toothCurveAngle) * rOut) + " ");
            pathD += ("L" + (gear.center.x + Math.cos(pa) * rIn) + ", " + (gear.center.y + Math.sin(pa) * rIn) + " ");
            pathD += ("L" + (gear.center.x + Math.cos(a) * rIn) + ", " + (gear.center.y + Math.sin(a) * rIn) + " ");
            pathD += ("L" + (gear.center.x + Math.cos(a + gear.toothCurveAngle) * rOut) + ", " + (gear.center.y + Math.sin(a + gear.toothCurveAngle) * rOut) + " ");
        }

        if (gear.hasHole) {
            const holeRadius = .5 * rIn;
            pathD += ("M" + (gear.center.x - holeRadius) + ", " + (gear.center.y) + " ");
            pathD += `A ${holeRadius} ${holeRadius} 1 1 0 ${gear.center.x + holeRadius} ${gear.center.y}`;
            pathD += `A ${holeRadius} ${holeRadius} 1 1 0 ${gear.center.x - holeRadius} ${gear.center.y}`;
        }

        if (dIdx === 0) {
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            gsap.set(circle, {
                attr: {
                    cx: gear.center.x,
                    cy: gear.center.y,
                    r: 5,
                    fill: "#000000"
                }
            })
            gearsContainer.appendChild(circle);
            gsap.set(path, {
                attr: {
                    fill: "#000000",
                    "fill-opacity": .25
                }
            })

        } else if (dIdx === (data.length - 1)) {
            gsap.set(path, {
                attr: {
                    fill: "#000000",
                    "fill-opacity": .25
                }
            })
            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            gsap.set(circle, {
                attr: {
                    cx: gear.center.x + handleRadius,
                    cy: gear.center.y,
                    r: 5,
                    fill: "#000000"
                }
            })
            gear.group.appendChild(circle);
        }

        path.setAttribute("d", pathD);


        const tl = gsap.timeline({
            repeat: -1,
            paused: true,
        })
            .to(group, {
                duration: params.speed * gear.teethNumber,
                rotation: 360 * (gear.idx % 2 ? -1 : 1),
                svgOrigin: gear.center.x + " " + gear.center.y,
                ease: "none",
            });

        if (dIdx === (data.length - 1)) {
            tl.eventCallback("onUpdate", () => {
                const angle = tl.progress() * 2 * Math.PI;
                const deltaY = Math.sin(angle) * handleRadius;
                gsap.set(pushingHand, {
                    y: deltaY,
                })
                if (deltaY > 8) {
                    const d = Math.max(0, deltaY - 8);
                    gsap.set(sprayerHead, {
                        y: d
                    })

                    let sprayProgress = Math.max(0, tl.progress() - .1);
                    sprayProgress *= (1 / .2);

                    let bubblesOpacity = (sprayProgress > 1) ? 0 : sprayProgress;
                    bubblesOpacity *= (1 - Math.pow(bubblesOpacity, 8));

                    const textProgress = Math.pow(sprayProgress / 1.5, 6);

                    if (!state.sumbitBtnOnPlace) {
                        state.sumbitBtnTextOpacity = (sprayRepeatCounter - 1) * .3 + .3 * textProgress;
                        state.sumbitBtnTextOpacity = Math.pow(state.sumbitBtnTextOpacity, 2);
                    }

                    gsap.set(submitBtn, {
                        color: "rgba(0, 0, 0, " + state.sumbitBtnTextOpacity + ")"
                    })
                    gsap.set(sprayLines, {
                        attr: {
                            "stroke-dashoffset": 70 * sprayProgress
                        },
                        opacity: Math.pow(bubblesOpacity, 2)
                    })
                    sprayBubbles.forEach((b, bIdx) => {
                        gsap.set(b, {
                            x: 25 * (1 - sprayProgress) * (1 + .1 * bIdx),
                            scale: .5 + 1.4 * Math.pow(sprayProgress, 2),
                            transformOrigin: "center center",
                            opacity: bubblesOpacity
                        })
                    })
                }

                gsap.set(gearConnector, {
                    attr: {
                        x1: gear.center.x + handleRadius * Math.cos(angle),
                        y1: gear.center.y + handleRadius * Math.sin(angle),
                        x2: 700 + 18,
                        y2: 646 - 100 + deltaY
                    }
                })
            });

            tl.eventCallback("onRepeat", () => {
                if (!state.sumbitBtnOnPlace) {
                    sprayRepeatCounter++;
                }
            });
        }

        tl.progress(0.6)
        tls.push(tl);
        gears.push(gear);
    })

    return tls;
}


function createPullingTimeline(isFixed, BtnPulled) {
    let tl = gsap.timeline({
        // paused: true,
        defaults: {
            ease: "power1.inOut",
            duration: 1
        },
        onUpdate: animatePullingLine
    });

    if (isFixed && BtnPulled) {
        tl
            .to(state, {
                pullProgress: 1
            }, 0)
            .to(submitBtn, {
                rotation: 0
            }, 0)
            .to(state, {
                duration: .1,
                sumbitBtnOnPlace: 1
            }, .9)
            .to(checkboxPullLine, {
                attr: {y2: 44 - 130}
            }, 0)
            .to(checkboxPullCircle, {
                y: 44 - 130
            }, 0)
    } else if (!isFixed && BtnPulled) {
        tl
            .to(state, {
                pullProgress: 1
            }, 0)
            .to(checkboxPullLine, {
                attr: {y2: 44 - 130}
            }, 0)
            .to(checkboxPullCircle, {
                y: 44 - 130
            }, 0)
    } else if (isFixed && !BtnPulled) {
        tl
            .to(state, {
                pullProgress: 0
            }, 0)
            .to(submitBtn, {
                rotation: -90
            }, 0)
            .to(state, {
                duration: .1,
                sumbitBtnOnPlace: 0
            }, 0)
            .to(checkboxPullLine, {
                attr: {y2: 44}
            }, 0)
            .to(checkboxPullCircle, {
                y: 44
            }, 0)
    } else if (!isFixed && !BtnPulled) {
        tl
            .to(state, {
                pullProgress: 0
            }, 0)
            .to(checkboxPullLine, {
                attr: {y2: 44}
            }, 0)
            .to(checkboxPullCircle, {
                y: 44
            }, 0)
    }


    function animatePullingLine() {
        const buttonOriginPoint = [260, -76];
        const btnWidth = 270;

        const deg = (gsap.getProperty(submitBtn, "rotation") - 4) * Math.PI / 180;

        const btnEnd = [
            buttonOriginPoint[0] - (btnWidth - 20) * Math.cos(deg),
            buttonOriginPoint[1] - (btnWidth - 20) * Math.sin(deg),
        ]
        gsap.set(btnHandlerCircle, {
            attr: {
                cx: btnEnd[0],
                cy: btnEnd[1]
            }
        })

        const handle = 7;
        const r = 10;

        let btnPullLinePath = "M" + (-r - handle) + "," + (250 - (isFixed ? 0 : state.pullProgress * 300));
        btnPullLinePath += "h" + (2 * handle);
        btnPullLinePath += "h" + (-handle);
        btnPullLinePath += " V" + (44 - state.pullProgress * 130);
        const slideAngle = .3 * Math.PI * (1 - (isFixed ? 1 : .5) * state.pullProgress);
        const dx = r * Math.cos(slideAngle);
        const dy = -r * Math.sin(slideAngle);
        btnPullLinePath += "a" + r + ', ' + r + " 0 0 1 " + (r + dx) + " " + dy;
        btnPullLinePath += " L" + btnEnd[0] + "," + btnEnd[1];

        gsap.set(btnPullLine, {
            attr: {
                d: btnPullLinePath
            },
            strokeWidth: 3
        })
    }

    return tl;
}