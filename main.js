/**
 * main.js - Logic for Sri Chitra Spinners
 */

document.addEventListener('DOMContentLoaded', () => {

    // 0. Populate Web3Forms Access Key from Config
    const accessKeyInput = document.getElementById('accessKey');
    if (accessKeyInput && typeof CONFIG !== 'undefined') {
        accessKeyInput.value = CONFIG.WEB3FORMS_ACCESS_KEY;
    }

    // 0.5 Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        // Toggle menu on hamburger click
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Prevent body scroll when menu is open on mobile
            if (window.innerWidth <= 768) {
                document.body.style.overflow = isActive ? 'hidden' : '';
            }
        });

        // Close menu when a link is clicked
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Prevent menu close when clicking inside nav-links
        navLinks.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Reset body overflow on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                document.body.style.overflow = '';
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // 1. Intersection Observer for Fade-Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');

    // Fallback in case IntersectionObserver fails to load or script errors out
    // Set a timeout to reveal all elements after 2 seconds no matter what
    setTimeout(() => {
        fadeElements.forEach(el => el.classList.add('visible'));
    }, 2000);

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    fadeElements.forEach(el => fadeObserver.observe(el));


    // 2. Animated Counters
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true;
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;

                        // Calculate speed based on target
                        const speed = 200;
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.capacity-hub');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }


    // 3. Form Handling Engine (Web3Forms Integration)
    const form = document.getElementById('rfqForm');
    const formStatus = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate Mobile Number
            const mobileInput = document.getElementById('mobile');
            if (mobileInput) {
                const mobileValue = mobileInput.value.trim();
                
                // Check if it's exactly 10 digits
                if (!/^\d{10}$/.test(mobileValue)) {
                    formStatus.className = 'form-status error';
                    formStatus.innerText = 'Mobile number must be exactly 10 digits.';
                    return;
                }
                
                // Check if it starts with 6, 7, 8, or 9
                if (!/^[6-9]/.test(mobileValue)) {
                    formStatus.className = 'form-status error';
                    formStatus.innerText = 'Indian mobile numbers must start with 6, 7, 8, or 9.';
                    return;
                }
            }

            // Animate Button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending Details...";
            submitBtn.disabled = true;

            formStatus.className = 'form-status';
            formStatus.innerText = '';

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;

                    if (response.status == 200) {
                        formStatus.className = 'form-status success';
                        formStatus.innerText = "Thank you! Your RFQ has been successfully sent to the team.";
                        form.reset();
                    } else {
                        console.log(response);
                        formStatus.className = 'form-status error';
                        formStatus.innerText = jsonResponse.message || "Something went wrong. Please try again.";
                    }
                })
                .catch(error => {
                    console.log(error);
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                    formStatus.className = 'form-status error';
                    formStatus.innerText = "Something went wrong! Please check your internet connection.";
                })
                .then(function () {
                    // Clear message after 5 seconds
                    setTimeout(() => {
                        formStatus.innerText = '';
                        formStatus.className = 'form-status';
                    }, 5000);
                });
        });
    }

    // 4. Navbar Blur Effect on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(248, 249, 250, 0.95)';
            navbar.style.boxShadow = 'var(--glass-shadow)';
        } else {
            navbar.style.background = 'rgba(248, 249, 250, 0.85)';
            navbar.style.boxShadow = 'none';
        }
    });
});

/**
 * Download Corporate Profile as PDF
 */
function downloadCorporateProfile(e) {
    e.preventDefault();
    
    const element = document.createElement('div');
    element.innerHTML = `
        <div style="font-family: 'Outfit', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #002366; padding-bottom: 20px;">
                <h1 style="color: #002366; font-size: 28px; margin: 0; font-weight: 800;">SRI CHITRA SPINNERS</h1>
                <p style="color: #4A5568; margin: 8px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">EST. 2008</p>
                <p style="color: #666; margin: 8px 0 0 0; font-size: 11px;">A 18-Year Legacy in High-Performance Cotton Yarn</p>
            </div>

            <!-- Company Overview -->
            <div style="margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Company Overview</h2>
                <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #333;">
                    Sri Chitra Spinners is a premier MSME specializing in high-performance cotton yarn manufacturing since 2008. Located in Tiruppur, Tamil Nadu, we deliver Auto-Coned and Non Auto-Coned yarn solutions for the modern textile industry with unmatched precision and quality.
                </p>
            </div>

            <!-- Leadership Team -->
            <div style="margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Leadership & Founders</h2>
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #333;"><strong>Chinnasamy Arumugam</strong> - Founder & Visionary</p>
                <p style="margin: 0 0 8px 0; font-size: 11px; color: #666;">With extensive textile manufacturing expertise, established SCS in 2007 with technical excellence and quality focus.</p>
                <p style="margin: 0 0 6px 0; font-size: 11px; color: #333;"><strong>Chitra Chinnasamy</strong> - Co-Founder & Operations Lead</p>
                <p style="margin: 0; font-size: 11px; color: #666;">Oversees operational excellence and strict adherence to our 4-pillar quality control protocol.</p>
            </div>

            <!-- Product Portfolio -->
            <div style="margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Product Portfolio</h2>
                <div style="margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 11px; color: #333;"><strong>Auto-Coned Yarn</strong></p>
                    <p style="margin: 0; font-size: 11px; color: #666;">Flagshipproduct with zero-knot spliced technology, high-speed knitting compatibility, and electronic yarn clearing.</p>
                </div>
                <div>
                    <p style="margin: 0; font-size: 11px; color: #333;"><strong>Industrial Non Auto-Coned Yarn</strong></p>
                    <p style="margin: 0; font-size: 11px; color: #666;">Robust, durable yarn for traditional weaving with high tensile strength and cost-effective solutions.</p>
                </div>
            </div>

            <!-- Technical Specifications -->
            <div style="margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Technical Specifications</h2>
                <table style="width: 100%; font-size: 10px; border-collapse: collapse;">
                    <tr style="background-color: #F0F2F5; border-bottom: 1px solid #ddd;">
                        <td style="padding: 6px; font-weight: 600; color: #002366;">Material</td>
                        <td style="padding: 6px;">Cotton (Shankar-6)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 6px; font-weight: 600; color: #002366;">Specialization</td>
                        <td style="padding: 6px;">Auto-Coned & Ring Spun yarn</td>
                    </tr>
                    <tr style="background-color: #F0F2F5; border-bottom: 1px solid #ddd;">
                        <td style="padding: 6px; font-weight: 600; color: #002366;">Features</td>
                        <td style="padding: 6px;">High CSP & Uniform TPI</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #ddd;">
                        <td style="padding: 6px; font-weight: 600; color: #002366;">Packing</td>
                        <td style="padding: 6px;">PP Woven Fabric Bags</td>
                    </tr>
                    <tr style="background-color: #F0F2F5;">
                        <td style="padding: 6px; font-weight: 600; color: #002366;">Usage</td>
                        <td style="padding: 6px;">Weft Yarn in Weaving</td>
                    </tr>
                </table>
            </div>

            <!-- Quality Assurance -->
            <div style="margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Quality Assurance - 4-Pillar Protocol</h2>
                <ul style="margin: 0; padding-left: 20px; font-size: 11px; color: #333;">
                    <li style="margin-bottom: 4px;"><strong>Raw Material Selection:</strong> Premium Shankar-6 cotton for maximum strength</li>
                    <li style="margin-bottom: 4px;"><strong>In-process Monitoring:</strong> Continuous automated and manual checks throughout production</li>
                    <li style="margin-bottom: 4px;"><strong>CSP Testing:</strong> Rigorous Count Strength Product evaluation for durability</li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #F0F2F5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #002366; font-size: 14px; font-weight: 700; text-transform: uppercase; margin: 0 0 10px 0;">Contact Information</h2>
                <div style="font-size: 11px; color: #333;">
                    <p style="margin: 0 0 6px 0;"><strong>Factory Address:</strong> Ichipatti, Tiruppur, Tamil Nadu 641 668, India</p>
                    <p style="margin: 0 0 6px 0;"><strong>Phone:</strong> +91 9965193971</p>
                    <p style="margin: 0 0 6px 0;"><strong>Email:</strong> srichitraspinners@gmail.com</p>
                    <p style="margin: 0 0 6px 0;"><strong>GSTIN:</strong> 33ABOFS1188C1Z6</p>
                    <p style="margin: 0;"><strong>Status:</strong> MSME Registered | Business Hours: Mon-Sat, 09:00 AM - 06:00 PM IST</p>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
                <p style="margin: 0; font-size: 10px; color: #666;">© 2026 Sri Chitra Spinners. Engineering the Thread of Excellence.</p>
                <p style="margin: 5px 0 0 0; font-size: 9px; color: #999;">Visit: www.srichitraspinners.com</p>
            </div>
        </div>
    `;

    // Generate PDF
    const options = {
        margin: 10,
        filename: 'Sri_Chitra_Spinners_Corporate_Profile.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };

    html2pdf().set(options).from(element).save();
}
