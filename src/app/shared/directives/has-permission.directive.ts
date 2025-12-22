// src/app/shared/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { PermissionService } from '../../core/services/permission.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  @Input('hasPermission') permission!: string;

  constructor(
    private tpl: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private permService: PermissionService
  ) {}

  ngOnInit() {
    // Fast synchronous check (works if permissions already loaded)
    if (this.permService.has(this.permission)) {
      this.vcr.createEmbeddedView(this.tpl);
      return;
    }

    // Otherwise load (or refresh) and then decide
    this.permService.load().subscribe(perms => {
      if (perms.includes(this.permission)) {
        this.vcr.createEmbeddedView(this.tpl);
      } else {
        this.vcr.clear();
      }
    });
  }
}
