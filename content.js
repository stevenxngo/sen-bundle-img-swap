const observeImage = async (img) => {
  if (img.classList.contains("overlay-applied")) {
    return;
  }

  const newImg = document.createElement("img");
  index = Math.floor(Math.random() * 10);
  const randomSen = chrome.runtime.getURL(`assets/sen_bundle${index}.jpeg`);
  newImg.src = randomSen;
  newImg.style.position = "absolute";
  newImg.classList.add("overlay-applied");

  const rect = img.getBoundingClientRect();
  newImg.style.left = `${rect.left + window.scrollX}px`;
  newImg.style.top = `${rect.top + window.scrollY}px`;
  newImg.style.width = `${rect.width}px`;
  newImg.style.height = `${rect.height}px`;

  document.body.appendChild(newImg);
  img.style.opacity = "0";
  img.classList.add("overlay-applied");
};

const imageObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        await observeImage(entry.target);
      }
    });
  },
  {
    rootMargin: "0px",
    threshold: 0.1,
  }
);

const setupObservers = () => {
  document
    .querySelectorAll('div[data-testid="tweetPhoto"] img')
    .forEach(async (img) => {
      imageObserver.observe(img);
    });

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.tagName === "IMG") {
          imageObserver.observe(node);
        }
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });
};

setupObservers();
