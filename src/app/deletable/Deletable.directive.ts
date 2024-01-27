import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[deletable]",
    standalone: true
})
export class DeletableDirective {
    @Input("deletable") onDelete
    @Input("deletableIf") deletable: boolean = true

    child: HTMLDivElement

    constructor(public elementRef: ElementRef) { }

    @HostListener("mouseenter") hoverover() {
        if (!this.deletable) return
        this.child = (this.elementRef.nativeElement as HTMLElement).appendChild(document.createElement("div"))
        this.elementRef.nativeElement.style.position = "relative"
        this.child.style.backgroundColor = "transparent"
        this.child.style.width = "20px"
        this.child.style.height = "20px"
        this.child.style.position = "absolute"
        this.child.style.borderRadius = "4px"
        this.child.style.top = "10px"
        this.child.style.right = "10px"
        this.child.style.cursor = "pointer"
        this.child.innerText = "❌"
        this.child.style.textAlign = "center"

        this.child.addEventListener("click", () => {
            this.onDelete()
        })
    }

    @HostListener("mouseleave") hoverleave() {
        if (!this.deletable) return
        (this.elementRef.nativeElement as HTMLElement).removeChild(this.child)
    }
}