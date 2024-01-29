import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
    selector: "[largetext]",
    standalone: true
})
export class LargeTextDirective {
    @Input("largetext") text: string
    @Input("max") maxLength: number
    extended = false
    constructor(public elementRef: ElementRef) { }

    ngOnInit() {
        if (this.text.length > this.maxLength) {
            this.elementRef.nativeElement.innerText = this.text.substring(0, this.maxLength-4) + "..."
        } else {
            this.elementRef.nativeElement.innerText = this.text
        }
    }

    @HostListener("click") click() {
        this.extended = !this.extended

        if (this.extended) this.elementRef.nativeElement.innerText = this.text
        else {
            if (this.text.length > this.maxLength) {
                this.elementRef.nativeElement.innerText = this.text.substring(0, this.maxLength-4) + "..."
                this.elementRef.nativeElement.style.cursor = "pointer"
            } else {
                this.elementRef.nativeElement.innerText = this.text
            }
        }
    }
}