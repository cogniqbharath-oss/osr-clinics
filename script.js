// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = mobileToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
});

// Simple AOS (Animate on Scroll) implementation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-aos]').forEach(el => {
    observer.observe(el);
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value;

    // Show success message
    alert(`Thank you, ${name}! We've received your message and will contact you shortly at ${email || phone}.`);

    // Reset form
    contactForm.reset();
});

// Chatbot functionality
const chatbotTrigger = document.getElementById('chatbotTrigger');
const voiceAssistantTrigger = document.getElementById('voiceAssistantTrigger');
const chatbot = document.getElementById('chatbot');
const chatbotClose = document.querySelector('.chatbot-close');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');

let conversationHistory = [];
// Voice Assistant Variables
let speechRecognition;
let isListening = false;
let synth = window.speechSynthesis;
let voiceEnabled = false; // User must activate voice manually first
let autoListen = false; // Hands-free mode flag

// Toggle chatbot
chatbotTrigger.addEventListener('click', () => {
    chatbot.classList.add('active');
    chatbotTrigger.style.display = 'none';
    chatInput.focus();
});

chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('active');
    chatbotTrigger.style.display = 'flex';
});

// Add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `<p>${text}</p>`;

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="message-content"><p>...</p></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Handle chat message
async function handleChatMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, true);
    conversationHistory.push({ role: 'user', content: message });
    chatInput.value = '';

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
        // Send to API
        const response = await fetch('https://old-block-0623.cogniq-bharath.workers.dev/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        const data = await response.json();

        // Remove typing indicator
        typingIndicator.remove();

        // Add bot response
        const botMessage = data.response || "I apologize, but I'm having trouble connecting right now. Please call us at (519) 419-1484 or book online at osrclinics.com/book";
        addMessage(botMessage);
        conversationHistory.push({ role: 'assistant', content: botMessage });

        // Speak response if voice was enabled
        if (voiceEnabled) {
            speak(botMessage);
        }

    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        addMessage("I'm having trouble connecting. Please call us at (519) 419-1484 for immediate assistance, or book online at osrclinics.com/book");
        speak("I'm having trouble connecting. Please call us for assistance.");
    }
}

// === Voice Assistant Implementation ===

// Initialize Speech Recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        speechRecognition = new SpeechRecognition();
        speechRecognition.continuous = false;
        speechRecognition.interimResults = false;
        speechRecognition.lang = 'en-US';

        speechRecognition.onstart = () => {
            isListening = true;
            voiceAssistantTrigger.classList.add('active-mode');
            voiceAssistantTrigger.innerHTML = '<i class="fas fa-wave-square"></i>';
        };

        speechRecognition.onend = () => {
            isListening = false;
            if (!autoListen) {
                voiceAssistantTrigger.classList.remove('active-mode');
                voiceAssistantTrigger.innerHTML = '<i class="fas fa-microphone"></i>';
            }
            // Auto-send if we captured speech
            if (chatInput.value.trim().length > 0) {
                handleChatMessage();
            }
        };

        speechRecognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
        };

        speechRecognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            isListening = false;
            voiceAssistantTrigger.classList.remove('active-mode');
            voiceAssistantTrigger.innerHTML = '<i class="fas fa-microphone"></i>';

            // If it's a no-speech error in hands-free mode
            if (event.error === 'no-speech' && autoListen) {
                autoListen = false;
            }
        };
    } else {
        voiceAssistantTrigger.style.display = 'none'; // Hide if not supported
        console.log('Web Speech API not supported in this browser.');
    }
}

// Text-to-Speech Function
function speak(text) {
    if (!synth) return;

    // Stop any current speech
    synth.cancel();

    // Create utterance
    // Strip URLs and simple formatting for cleaner speech
    const cleanText = text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, 'our website').replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Select a male voice if available
    const voices = synth.getVoices();
    // Prioritize "Male" voices, specifically Google US English Male if possible
    const preferredVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('David') || voice.name.includes('Guy')) || voices[0];

    if (preferredVoice) {
        utterance.voice = preferredVoice;
        // Lower pitch slightly for a more masculine tone if needed, but default is usually fine
        utterance.pitch = 0.9;
    }

    utterance.rate = 1;
    utterance.pitch = 1;

    // Hands-free logic: Listen after speaking
    utterance.onend = () => {
        if (autoListen) {
            // Short delay before listening again
            setTimeout(() => {
                if (!isListening && speechRecognition) {
                    try {
                        speechRecognition.start();
                    } catch (e) {
                        console.error("Could not restart recognition:", e);
                    }
                }
            }, 500);
        }
    };

    synth.speak(utterance);
}

// Toggle Voice Input
if (voiceAssistantTrigger) {
    initSpeechRecognition();

    voiceAssistantTrigger.addEventListener('click', () => {
        if (!speechRecognition) {
            alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        if (isListening || autoListen) {
            // Stop everything
            speechRecognition.stop();
            autoListen = false;
            voiceAssistantTrigger.classList.remove('active-mode');
            voiceAssistantTrigger.innerHTML = '<i class="fas fa-microphone"></i>';
            synth.cancel(); // Stop speaking if currently speaking
        } else {
            // Start Voice Mode
            conversationHistory = [];
            autoListen = true; // Enable hands-free mode
            voiceEnabled = true;

            // Ensure chatbot is open
            chatbot.classList.add('active');
            chatbotTrigger.style.display = 'none';

            try {
                speechRecognition.start();
            } catch (e) {
                console.error("Start error:", e);
            }
        }

        chatInput.focus();
    });
}

// Send message on button click
chatSend.addEventListener('click', handleChatMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChatMessage();
    }
});

// Quick response suggestions (optional enhancement)
const quickResponses = [
    "What services do you offer?",
    "How do I book an appointment?",
    "Do you offer virtual appointments?",
    "What are your hours?",
    "Tell me about ADHD assessments"
];

// Add quick response chips on first load (optional)
function addQuickResponses() {
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'quick-responses';
    chipsContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border);';

    quickResponses.forEach(response => {
        const chip = document.createElement('button');
        chip.textContent = response;
        chip.style.cssText = 'background: var(--bg-light); border: 1px solid var(--border); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.875rem; cursor: pointer; transition: var(--transition);';

        chip.addEventListener('click', () => {
            chatInput.value = response;
            handleChatMessage();
            chipsContainer.remove();
        });

        chip.addEventListener('mouseenter', () => {
            chip.style.background = 'var(--primary)';
            chip.style.color = 'white';
            chip.style.borderColor = 'var(--primary)';
        });

        chip.addEventListener('mouseleave', () => {
            chip.style.background = 'var(--bg-light)';
            chip.style.color = 'var(--text-dark)';
            chip.style.borderColor = 'var(--border)';
        });

        chipsContainer.appendChild(chip);
    });

    chatMessages.appendChild(chipsContainer);
}

// Intersection observer for scroll animations
const fadeElements = document.querySelectorAll('.service-card, .location-card, .feature-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// Add loading animation for hero section
window.addEventListener('load', () => {
    const heroText = document.querySelector('.hero-text');
    if (heroText) {
        heroText.style.animation = 'fadeInUp 1s ease forwards';
    }
});

// CSS for fadeInUp animation (add to style if not present)
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        padding: 2rem;
        box-shadow: var(--shadow-lg);
    }
    
    @media (min-width: 969px) {
        .nav-menu.active {
            display: flex;
            flex-direction: row;
            position: static;
            padding: 0;
            box-shadow: none;
        }
    }
`;
document.head.appendChild(style);
