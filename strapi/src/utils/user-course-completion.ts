

export function createPageCompletion(id: number, subchapter: number){
    return {id, subchapter, completed: false}
}

export function createSubchapterCompletion(id: number, chapter: number){
    return {id, chapter, completed: false}
}

export function createChapterCompletion(id: number, course: number){
    return {id, course, completed: false}
}