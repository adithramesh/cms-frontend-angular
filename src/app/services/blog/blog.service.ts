import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogRequestDTO, BlogResponseDTO, BlogListResponseDTO } from '../../models/blog.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.BACK_END_API_URL}/articles`;

  getAllBlogs(): Observable<BlogListResponseDTO> {
    return this.http.get<BlogListResponseDTO>(`${this.apiUrl}`);
  }

  getBlogById(id: string): Observable<BlogResponseDTO> {
    return this.http.get<BlogResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getBlogsByUserId(): Observable<BlogListResponseDTO> {
    return this.http.get<BlogListResponseDTO>(`${this.apiUrl}/me`);
  }

  createBlog(blogData: { title?: string; content?: string }): Observable<BlogResponseDTO> {
    return this.http.post<BlogResponseDTO>(`${this.apiUrl}`, blogData );
  }

  updateBlog(id: string, blogData: { title?: string; content?: string }): Observable<BlogResponseDTO> {
    return this.http.patch<BlogResponseDTO>(`${this.apiUrl}/${id}`, blogData);
  }

  deleteBlog(id: string):Observable<{success:boolean, message:string}>{
    return this.http.delete<{success:boolean, message:string}>(`${this.apiUrl}/${id}`)
  }
}