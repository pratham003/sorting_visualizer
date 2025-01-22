const n = 20;
const array = [];
let animationTimeout = null; // Track the timeout to stop animations

init(); // Automatically load when refreshing the page

function init() {
  // Clear any ongoing animations
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }

  // Initialize the array with random values
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
}

function playBubbleSort() {
  stopOngoingSort();
  const copy = [...array];
  const moves = bubbleSort(copy); // Capture moves returned from bubbleSort
  animate(moves); // Animate the moves
}

function playMergeSort() {
  stopOngoingSort();
  const copy = [...array];
  const moves = [];
  mergeSort(copy, 0, copy.length - 1, moves);
  animate(moves); // Animate the moves
}

function playQuickSort() {
  stopOngoingSort();
  const copy = [...array];
  const moves = [];
  quickSort(copy, 0, copy.length - 1, moves);
  animate(moves); // Animate the moves
}

function stopOngoingSort() {
  if (animationTimeout) {
    clearTimeout(animationTimeout);
    animationTimeout = null;
  }
}

function animate(moves) {
  if (moves.length === 0) {
    showBars();
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;

  // Swap the elements
  [array[i], array[j]] = [array[j], array[i]];
  showBars(move);

  animationTimeout = setTimeout(() => {
    animate(moves);
  }, 50);
}

function showBars(move) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");

    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = "red"; // Highlighting swapped indices
    }

    container.appendChild(bar);
  }
}

// Bubble sort logic
function bubbleSort(array) {
  const moves = [];
  for (let i = array.length - 1; i > 0; i--) {
    for (let j = 0; j < i; j++) {
      if (array[j] > array[j + 1]) {
        moves.push({ indices: [j, j + 1] }); // Store indices
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }
  return moves;
}

// Merge sort logic
function merge(arr, low, mid, high, moves) {
  const temp = [];
  let left = low;
  let right = mid + 1;

  // Merge the two halves
  while (left <= mid && right <= high) {
    if (arr[left] <= arr[right]) {
      temp.push(arr[left]);
      left++;
    } else {
      temp.push(arr[right]);
      right++;
    }
  }

  // Copy remaining elements from the left half, if any
  while (left <= mid) {
    temp.push(arr[left]);
    left++;
  }

  // Copy remaining elements from the right half, if any
  while (right <= high) {
    temp.push(arr[right]);
    right++;
  }

  // Copy the merged elements back into the original array and record the moves
  let tempIndex = 0;
  for (let i = low; i <= high; i++) {
    arr[i] = temp[tempIndex];
    moves.push({ indices: [i, i] }); // Record the "move" for the visual effect
    tempIndex++;
  }
}

function mergeSort(arr, low, high, moves) {
  if (low >= high) return;

  // Calculate the midpoint
  const mid = Math.floor((low + high) / 2);

  // Sort first and second halves
  mergeSort(arr, low, mid, moves);
  mergeSort(arr, mid + 1, high, moves);

  // Merge the sorted halves
  merge(arr, low, mid, high, moves);
}

// Quick sort logic
function quickSort(array, low, high, moves) {
  if (low >= high) return;

  const pivotIndex = partition(array, low, high, moves);
  quickSort(array, low, pivotIndex - 1, moves);
  quickSort(array, pivotIndex + 1, high, moves);
}

function partition(array, low, high, moves) {
  const pivot = array[high];
  let i = low;

  for (let j = low; j < high; j++) {
    if (array[j] < pivot) {
      moves.push({ indices: [i, j] }); // Store indices
      [array[i], array[j]] = [array[j], array[i]];
      i++;
    }
  }
  moves.push({ indices: [i, high] }); // Store indices
  [array[i], array[high]] = [array[high], array[i]];
  return i;
}
