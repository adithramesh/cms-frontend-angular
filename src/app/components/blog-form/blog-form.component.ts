import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BlogService } from '../../services/blog/blog.service';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './blog-form.component.html',
  styleUrl: './blog-form.component.scss'
})
export class BlogFormComponent implements OnInit, OnDestroy {
  mode: 'create' | 'edit' = 'create';
  blogId: string | null = null;
  
  
  private _fb = inject(FormBuilder);
  blogForm = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    image: [null as File | null]
  });
  
  imagePreview: string | null = null;
  isSubmitting = false;

  private _blogService = inject(BlogService);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastr = inject(ToastrService);
  private _subscription = new Subscription();

  ngOnInit() {
    this.blogId = this._route.snapshot.paramMap.get('id');
    
    if (this.blogId) {
      this.mode = 'edit';
      this.loadBlogForEdit();
    }
  }

  loadBlogForEdit() {
    if (!this.blogId) return;
    
    const sub = this._blogService.getBlogById(this.blogId).subscribe({
      next: (blog) => {
   
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content
        });
        
        if (blog.imageUrl) {
          this.imagePreview = `https://res.cloudinary.com/${environment.CLOUDINARY_CLOUD_NAME}/image/upload/${blog.imageUrl}`;
        }
      },
      error: () => this._toastr.error('Failed to load blog')
    });
    this._subscription.add(sub);
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this._toastr.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        input.value = ''; 
        return;
      }

    
      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        this._toastr.error('Image size should not exceed 5MB');
        input.value = ''; 
        return;
      }

   
      this.blogForm.patchValue({ image: file });

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
   
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      this._toastr.warning('Please fill in all required fields correctly');
      return;
    }

    const user = this._authService.getCurrentUser();
    if (!user) {
      this._toastr.error('User not authenticated');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const formValue = this.blogForm.value;
    
    formData.append('title', formValue.title!);
    formData.append('content', formValue.content!);
    formData.append('authorId', user.id);
    
    if (formValue.image) {
      formData.append('image', formValue.image);
    }

    if (this.mode === 'create') {
      const sub = this._blogService.createBlog(formData).subscribe({
        next: () => {
          this._toastr.success('Blog created successfully!');
          this._router.navigate(['/blogs']);
        },
        error: (err) => {
          console.error('Create blog error:', err);
          this._toastr.error('Failed to create blog');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
      this._subscription.add(sub);
    } else if (this.blogId) {
      const sub = this._blogService.updateBlog(this.blogId, formData).subscribe({
        next: () => {
          this._toastr.success('Blog updated successfully!');
          this._router.navigate(['/blogs', this.blogId]);
        },
        error: (err) => {
          console.error('Update blog error:', err);
          this._toastr.error('Failed to update blog');
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
      this._subscription.add(sub);
    }
  }

  cancel() {
    this._router.navigate(['/blogs']);
  }

  // Helper methods for template validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string, errorType: string): boolean {
    const field = this.blogForm.get(fieldName);
    return !!(field && field.errors?.[errorType]);
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }
}
