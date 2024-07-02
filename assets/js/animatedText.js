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
    return new Promise((resolve) => {
      if (this.textContainer) {
        this.createSpans(this.sentences);
        setTimeout(() => {
          this.sequenceTextAndAnimation(
            document.getElementById("homeText")
          ).then(() => {
            resolve();
          });
        }, 500);
      } else {
        resolve();
      }
    });
  }

  createSpans(sentences) {
    sentences.forEach((sentence, index) => {
      const spanContainer = document.createElement("div");
      spanContainer.className = `span_container_${index + 1}`;
      spanContainer.style.opacity = 0;
      this.textContainer.appendChild(spanContainer);

      [...sentence].forEach((char) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.textContent = char === " " ? "\u00A0" : char;
        spanContainer.appendChild(span);
      });
    });
  }

  async sequenceTextAndAnimation(textToReplace) {
    const target = textToReplace;
    const sentenceArray = JSON.parse(textToReplace.dataset.text);
    const spanContainers = Array.from(this.textContainer.children);

    for (let index = 0; index < sentenceArray.length; index++) {
      if (index < sentenceArray.length) {
        await this.displayText(target, sentenceArray[index]);
      }

      if (index < spanContainers.length) {
        await this.animateSpans(spanContainers[index], index);
      }
    }

    await this.sleep(1500);

    target.textContent = "\u00A0";
  }

  async displayText(target, sentence) {
    target.textContent = "\u00A0";

    await this.sleep(700);

    for (let charIndex = 0; charIndex < sentence.length; charIndex++) {
      const char = sentence[charIndex];
      await this.sleep(40);
      target.textContent = target.textContent.slice(0, -1) + char + "\u00A0";
    }

    await this.sleep(500);
  }

  async animateSpans(spanContainer, sentenceIndex) {
    spanContainer.style.opacity = 1;
    const spanArray = Array.from(spanContainer.querySelectorAll(".letter"));
    await this.sleep(1500);
    await this.animateLetters(spanArray, sentenceIndex);
    await this.sleep(1000);
  }

  animateLetters(letters, sentenceIndex) {
    return new Promise((resolve) => {
      let totalOffset = 0;
      const initialOffsetY = 8;
      const verticalOffset = sentenceIndex * 24;
      let animationCompleted = 0;

      letters.forEach((letter, index) => {
        const rect = letter.getBoundingClientRect();
        // ↓ Avec changement de la taille de police pendant l'animation
        const deltaX = rect.left - totalOffset + 10;
        // ↓ Sans changement de la taille de police pendant l'animation
        // const deltaX = rect.left - totalOffset - 10;
        const deltaY = rect.top - initialOffsetY - verticalOffset;

        setTimeout(() => {
          requestAnimationFrame(() => {
            letter.style.transition = "transform 0.4s ease-out";
            letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(-45deg)`;
            letter.style.fontSize = "1.8rem";
          });

          setTimeout(() => {
            letter.style.transition = "transform 0.1s ease-out";
            letter.style.transform = `translate(-${deltaX}px, -${deltaY}px) rotate(0)`;
            setTimeout(() => {
              letter.classList.add("blink");
            }, 300);
            setTimeout(() => {
              letter.style.color = "var(--fluo)";
            }, 600);
            animationCompleted += 1;
            if (animationCompleted === letters.length) {
              resolve();
            }
          }, 360);
        }, index * 30);

        totalOffset += rect.width;
      });
    });
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.remove("clean__transition");

  const textAnimation = new AnimatedText("text-container");
  const delay = 30;

  setTimeout(() => {
    textAnimation.init().then(() => {
      console.log("All is ok !");
    });
  }, delay);
});
