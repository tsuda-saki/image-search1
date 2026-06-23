let entries = [];
let currentImageDataUrl = null;
let currentImageFilename = null;

const STORAGE_KEY = "image_tag_form_entries";

// ----------------------
// 初期化
// ----------------------
function init() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      entries = JSON.parse(saved);
    } catch (e) {
      entries = [];
    }
  }
  renderList();
  updateOutput();

  document.getElementById("image-file").addEventListener("change", onImageSelected);
  document.getElementById("add-btn").addEventListener("click", addEntry);
  document.getElementById("json-file").addEventListener("change", onExistingJsonSelected);
  document.getElementById("download-btn").addEventListener("click", downloadJson);
  document.getElementById("copy-btn").addEventListener("click", copyJson);
  document.getElementById("reset-btn").addEventListener("click", resetAll);
}

// ----------------------
// 既存の images.json を読み込む
// ----------------------
function onExistingJsonSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (Array.isArray(parsed)) {
        entries = parsed;
        renderList();
        updateOutput();
        persist();
      } else {
        alert("JSONの形式が正しくありません（配列である必要があります）");
      }
    } catch (err) {
      alert("JSONの読み込みに失敗しました: " + err.message);
    }
  };
  reader.readAsText(file);
}

// ----------------------
// 画像が選択されたらプレビュー表示
// ----------------------
function onImageSelected(e) {
  const file = e.target.files[0];
  if (!file) return;

  currentImageFilename = file.name;

  const reader = new FileReader();
  reader.onload = (ev) => {
    currentImageDataUrl = ev.target.result;
    document.getElementById("preview-img").src = currentImageDataUrl;
    document.getElementById("preview-filename").textContent = file.name;
    document.getElementById("preview").style.display = "flex";
  };
  reader.readAsDataURL(file);
}

// ----------------------
// リストに追加
// ----------------------
function addEntry() {
  if (!currentImageFilename) {
    alert("画像ファイルを選択してください");
    return;
  }

  const tagsRaw = document.getElementById("tags").value.trim();
  if (!tagsRaw) {
    alert("タグを1つ以上入力してください");
    return;
  }

  const tags = tagsRaw.split(",").map(t => t.trim()).filter(t => t.length > 0);
  if (tags.length === 0) {
    alert("タグを1つ以上入力してください");
    return;
  }

  let folder = document.getElementById("folder").value.trim() || "img";
  folder = folder.replace(/^\/+|\/+$/g, "");

  const src = `${folder}/${currentImageFilename}`;

  entries.push({
    src,
    tags,
    preview: currentImageDataUrl
  });

  persist();
  renderList();
  updateOutput();

  document.getElementById("image-file").value = "";
  document.getElementById("tags").value = "";
  document.getElementById("preview").style.display = "none";
  currentImageDataUrl = null;
  currentImageFilename = null;
}

// ----------------------
// リスト表示
// ----------------------
function renderList() {
  const listEl = document.getElementById("entry-list");
  const emptyMsg = document.getElementById("empty-msg");
  listEl.innerHTML = "";

  if (entries.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";

  entries.forEach((item, index) => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = item.preview || item.src;
    img.alt = item.tags.join(", ");
    img.onerror = () => { img.style.visibility = "hidden"; };

    const info = document.createElement("div");
    info.className = "info";

    const srcEl = document.createElement("div");
    srcEl.className = "src";
    srcEl.textContent = item.src;

    const tagsEl = document.createElement("div");
    tagsEl.className = "tags";
    tagsEl.textContent = item.tags.join(", ");

    info.appendChild(srcEl);
    info.appendChild(tagsEl);

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "削除";
    removeBtn.onclick = () => {
      entries.splice(index, 1);
      persist();
      renderList();
      updateOutput();
    };

    li.appendChild(img);
    li.appendChild(info);
    li.appendChild(removeBtn);
    listEl.appendChild(li);
  });
}

// ----------------------
// 出力JSON更新（previewフィールドは出力に含めない）
// ----------------------
function updateOutput() {
  const exportData = entries.map(({ src, tags }) => ({ src, tags }));
  document.getElementById("json-output").value = JSON.stringify(exportData, null, 2);
}

// ----------------------
// ダウンロード
// ----------------------
function downloadJson() {
  const exportData = entries.map(({ src, tags }) => ({ src, tags }));
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "images.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ----------------------
// コピー
// ----------------------
function copyJson() {
  const text = document.getElementById("json-output").value;
  navigator.clipboard.writeText(text).then(() => {
    alert("JSONをコピーしました");
  }).catch(() => {
    alert("コピーに失敗しました");
  });
}

// ----------------------
// 全部クリア
// ----------------------
function resetAll() {
  if (!confirm("追加済みリストを全部クリアします。よろしいですか？")) return;
  entries = [];
  persist();
  renderList();
  updateOutput();
}

// ----------------------
// localStorageに保存（ブラウザを閉じても作業中のリストを保持）
// ----------------------
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn("localStorageへの保存に失敗しました", e);
  }
}

init();
