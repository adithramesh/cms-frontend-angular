import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlogRequestDTO, BlogResponseDTO, BlogListResponseDTO } from '../../models/blog.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private _http = inject(HttpClient);
  private _apiUrl = `${environment.BACK_END_API_URL}/articles`;

  getAllBlogs(): Observable<BlogListResponseDTO> {
    return this._http.get<BlogListResponseDTO>(`${this._apiUrl}`);
  }

  getBlogById(id: string): Observable<BlogResponseDTO> {
    return this._http.get<BlogResponseDTO>(`${this._apiUrl}/${id}`);
  }

  getBlogsByUserId(): Observable<BlogListResponseDTO> {
    return this._http.get<BlogListResponseDTO>(`${this._apiUrl}/me`);
  }

  createBlog(blogData: { title?: string; content?: string }): Observable<BlogResponseDTO> {
    return this._http.post<BlogResponseDTO>(`${this._apiUrl}`, blogData );
  }

  updateBlog(id: string, blogData: { title?: string; content?: string }): Observable<BlogResponseDTO> {
    return this._http.patch<BlogResponseDTO>(`${this._apiUrl}/${id}`, blogData);
  }

  deleteBlog(id: string):Observable<{success:boolean, message:string}>{
    return this._http.delete<{success:boolean, message:string}>(`${this._apiUrl}/${id}`)
  }
}