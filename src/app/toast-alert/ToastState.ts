import { EventEmitter } from "@angular/core"


export interface Toast {
    title: string,
    text: string,
    type: "danger" | "success"
}

export class ToastState {
    static toasts: Toast[] = []
    static toastAdd = new EventEmitter<Toast>()
    static toastDelete = new EventEmitter<number>()

    static addToast(toast: Toast) {
        this.toasts.push(toast)
        this.toastAdd.emit(toast)
    }

    static deleteToast(index: number) {
        this.toasts.splice(index, 1)
        this.toastDelete.emit(index)
    }
}