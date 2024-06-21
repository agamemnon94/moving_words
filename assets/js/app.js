window.addEventListener("load", () => {
  document.body.classList.remove("clean__transition");
});

class AnimatedText {
  constructor(elementId) {
    this.textContainer = document.getElementById(elementId);

    if (this.textContainer) {
      this.sentences = JSON.parse(
        this.textContainer.getAttribute("data-sentences")
      );
    }
  }

  init() {
    if (this.textContainer) {
      this.createSpans(this.sentences);
      this.replaceText(document.getElementById("homeText"));

      const spanContainers = document.querySelectorAll(
        '[class*="span_container_"]'
      );

      spanContainers.forEach((spans, index) => {
        let gap = 2 * index;
        const spanArray = Array.from(spans.querySelectorAll(".letter"));
        setTimeout(() => {
          spans.style.opacity = 1;
          setTimeout(() => {
            this.animateLetters(spanArray, gap);
          }, 3000);
        }, 3000 * index);
      });
    }
  }

  createSpans(sentences) {
    sentences.forEach((sentence, index) => {
      const spanContainer = document.createElement("div");
      spanContainer.className = `span_container_${index + 1}`;
      this.textContainer.appendChild(spanContainer);

      [...sentence].forEach((char) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = char === " " ? "\u00A0" : char;
        spanContainer.appendChild(span);
      });
    });
  }

  animateLetters(letters, gap) {
    let totalOffset = 0;
    const initialOffsetY = 8;
    letters.forEach((letter, index) => {
      setTimeout(() => {
        const rect = letter.getBoundingClientRect();
        const deltaX = rect.left - 2 - totalOffset;
        const deltaY = rect.top - initialOffsetY - 10 * gap;

        requestAnimationFrame(() => {
          letter.style.transition = "transform 0.4s ease-out";
          letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(-45deg)`;
        });

        setTimeout(() => {
          letter.style.transition = "transform 0.1s ease-out";
          letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(0)`;
          letter.style.fontSize = "1.8rem";
          setTimeout(() => {
            letter.classList.add("blink");
          }, 300);
          setTimeout(() => {
            letter.style.color = "var(--violine)";
          }, 600);
        }, 360);

        totalOffset += rect.width;
      }, index * 15);
    });
  }

  async replaceText(textToReplace) {
    const target = document.getElementById("homeText");
    const sentenceArray = JSON.parse(textToReplace.dataset.text);
    const title = document.querySelector(".landing-title");

    for (let index = 0; index < sentenceArray.length; index++) {
      const sentence = sentenceArray[index];
      if (index > 0) {
        target.textContent = "\u00A0";
      }

      for (let charIndex = 0; charIndex < sentence.length; charIndex++) {
        const char = sentence[charIndex];
        await this.sleep(80);
        target.textContent = target.textContent.slice(0, -1) + char + "\u00A0";
      }

      await this.sleep(1000);
    }

    await this.sleep(1500);
    target.textContent = "\u00A0";
    title.classList.add("animated_title");
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const textAnimation = new AnimatedText("text-container");
    textAnimation.init();
  }, 1500);
});

//Old code

// class AnimatedText {
//   constructor(elementId) {
//     this.textContainer = document.getElementById(elementId);

//     if (this.textContainer) {
//       this.sentences = JSON.parse(
//         this.textContainer.getAttribute("data-sentences")
//       );
//     }
//   }
//   init() {
//     if (this.textContainer) {
//       this.createSpans(this.sentences);
//       const spanContainer = document.querySelectorAll(
//         '[class*="span_container_"]'
//       );

//       this.replaceText(document.getElementById("homeText"));

//       spanContainer.forEach((spans, index) => {
//         const gap = 2.6 * index;
//         const spanArray = Array.from(spans.querySelectorAll(".letter"));
//         setTimeout(() => {
//           spans.style.opacity = 1;
//           setTimeout(() => {
//             this.animeLetters(spanArray, gap);
//           }, 2500);
//         }, 2500 * index);
//       });
//     }
//   }

//   createSpans(sentences) {
//     sentences.forEach((sentence, index) => {
//       const spanContainer = document.createElement("div");
//       spanContainer.className = `span_container_${index + 1}`;
//       this.textContainer.appendChild(spanContainer);

//       [...sentence].forEach((char) => {
//         const span = document.createElement("span");
//         span.className = "letter";
//         span.textContent = char === " " ? "\u00A0" : char;
//         spanContainer.appendChild(span);
//       });
//     });
//   }
//   animeLetters(letters, gap) {
//     let totalOffset = 0;
//     letters.forEach((letter, index) => {
//       setTimeout(() => {
//         const rect = letter.getBoundingClientRect();

//         const deltaX = rect.left - 10 - totalOffset;
//         const deltaY = rect.top - 10 * gap;

//         requestAnimationFrame(() => {
//           letter.style.transition = "transform 0.4s ease-out";
//           letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(-45deg)`;
//         });

//         setTimeout(() => {
//           letter.style.transition = "transform 0.1s ease-out";
//           letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(0)`;
//           setTimeout(() => {
//             letter.classList.add("blink");
//           }, 300);
//           setTimeout(() => {
//             letter.style.color = "var(--violine)";
//           }, 600);
//         }, 360);

//         totalOffset += rect.width;
//       }, index * 20);
//     });
//   }

//   replaceText(textToReplace) {
//     const target = document.getElementById("homeText");
//     const sentenceArray = JSON.parse(textToReplace.dataset.text);

//     let delay = 0;
//     sentenceArray.forEach((sentence, index) => {
//       setTimeout(() => {
//         if (index > 0) {
//           // Vider le contenu de targer avant la phrase suivante
//           target.textContent = "";
//         }

//         sentence.split("").forEach((char, charIndex) => {
//           setTimeout(() => {
//             target.textContent =
//               target.textContent.slice(0, -1) + char + "\u00A0";
//           }, charIndex * 80);
//         });
//       }, delay);

//       // Ajoute le temps nécessaire à l'affichage de la phrase avant de commencer l'affichage de la suivante.

//       delay += sentence.length * 80 + 1000;

//       setTimeout(() => {
//         target.textContent = "\u00A0";
//       }, delay + 3500);
//     });
//   }
// }

// document.addEventListener("DOMContentLoaded", () => {
//   setTimeout(() => {
//     const textAnimation = new AnimatedText("text-container");
//     textAnimation.init();
//   }, 1500);
// });
