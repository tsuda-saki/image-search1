let images = [];
let activeTag = null;

// ----------------------
// 初期化：JSONを読み込む
// ----------------------
async function init() {
  try {
    const res = await fetch("data/images.json");
    images = await res.json();
  } catch (e) {
    console.error("images.json の読み込みに失敗しました", e);
    images = [];
  }
  loadTags();
  search();

  document.getElementById("keyword").addEventListener("keydown", (e) => {
    if (e.key === "Enter") search();
  });
}

// ----------------------
// タグ一覧を生成
// ----------------------
function loadTags() {
  const tagSet = new Set();
  images.forEach(img => img.tags.forEach(t => tagSet.add(t)));

  const tagArea = document.getElementById("tagList");
  tagArea.innerHTML = "";

  [...tagSet].forEach(tag => {
    const btn = document.createElement("button");
    btn.textContent = tag;
    if (tag === activeTag) btn.classList.add("active");
    btn.onclick = () => {
      activeTag = activeTag === tag ? null : tag;
      document.getElementById("keyword").value = "";
      search();
    };
    tagArea.appendChild(btn);
  });
}

// ----------------------
// 検索
// ----------------------
function search() {
  const key = document.getElementById("keyword").value.trim().toLowerCase();
  const result = document.getElementById("result");
  const countLabel = document.getElementById("countLabel");
  result.innerHTML = "";

  const list = images.filter(img => {
    const matchesKeyword = key === "" || img.tags.some(tag => tag.includes(key));
    const matchesTag = activeTag === null || img.tags.includes(activeTag);
    return matchesKeyword && matchesTag;
  });

  countLabel.textContent = `${list.length} 件の画像`;
  loadTags();

  if (list.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "一致する画像がありません";
    result.appendChild(empty);
    return;
  }

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.tags.join(", ");
    img.loading = "lazy";

    const filename = document.createElement("div");
    filename.className = "filename";
    filename.textContent = item.src.split("/").pop();

    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "ダウンロード";
    btn.onclick = () => downloadImage(item.src);

    div.appendChild(img);
    div.appendChild(filename);
    div.appendChild(btn);
    result.appendChild(div);
  });
}

// ----------------------
// 検索クリア
// ----------------------
function clearSearch() {
  document.getElementById("keyword").value = "";
  activeTag = null;
  search();
}

// ----------------------
// 画像をダウンロード
// ----------------------
function downloadImage(url) {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop();
  document.body.appendChild(a);
  a.click();
  a.remove();
}

init();
