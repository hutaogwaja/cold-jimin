//피셔-예이츠 셔플
export async function randomSortArray(arr){
    for (var i=arr.length-1; i>0; i--) {
        // 0부터 i 사이의 무작위 인덱스 생성
        const j = Math.floor(Math.random() * (i + 1));
        // 자리를 서로 교환 (Destructuring assignment)
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}