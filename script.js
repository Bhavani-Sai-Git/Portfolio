const navMenu = document.getElementById("navMenu")
const header = document.querySelector(".header")
const navLinks = document.querySelectorAll(".nav a")

const menuBtn = document.createElement("div")
menuBtn.className = "menu-btn"
menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>'
header.appendChild(menuBtn)

menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("active")
})

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active")
    })
})

window.addEventListener("scroll", () => {
    if(window.scrollY > 50){
        header.classList.add("scrolled")
    } else {
        header.classList.remove("scrolled")
    }
})

const sections = document.querySelectorAll("section")

window.addEventListener("scroll", () => {
    let current = ""

    sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight

        if(scrollY >= sectionTop - sectionHeight / 3){
            current = section.getAttribute("id")
        }
    })

    navLinks.forEach(link => {
        link.classList.remove("active")
        if(link.getAttribute("href") === "#" + current){
            link.classList.add("active")
        }
    })
})

const role = "Java Developer"
const typingElement = document.getElementById("typing")

let charIndex = 0

function typeEffect(){
    if(charIndex < role.length){
        typingElement.textContent += role.charAt(charIndex)
        charIndex++
        setTimeout(typeEffect, 120)
    }
}
typeEffect()


const revealElements = document.querySelectorAll(".reveal")

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting){
                entry.target.classList.add("active")
            }
        })
    },
    {
        threshold: 0.15
    }
)

revealElements.forEach(el => revealObserver.observe(el))

const contactForm = document.getElementById("contactForm")
const nameInput = document.getElementById("name")
const emailInput = document.getElementById("email")
const messageInput = document.getElementById("message")
const formError = document.getElementById("formError")

contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    if(
        nameInput.value.trim() === "" ||
        emailInput.value.trim() === "" ||
        messageInput.value.trim() === ""
    ){
        formError.textContent = "All fields are required"
        return
    }

    if(!emailInput.value.includes("@")){
        formError.textContent = "Enter a valid email address"
        return
    }

    formError.textContent = "Message ready to send"
    contactForm.reset()
})



