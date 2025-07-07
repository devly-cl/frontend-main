import { Component, Inject, OnInit, ViewChildren }                                     from '@angular/core';
import { TranslocoDirective, TranslocoService }                                        from '@ngneat/transloco';
import { MatIcon }                                                                     from '@angular/material/icon';
import { MatButton, MatIconButton }                                                    from '@angular/material/button';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators }       from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix }                                           from '@angular/material/form-field';
import { MatChipRow }                                                                  from '@angular/material/chips';
import { DropzoneMaterialModule }                                                      from '@ngx-dropzone/material';
import { ImageUploadPreviewComponent }                                                 from '@modules/admin/admin/albums/components/image-upload-preview/image-upload-preview.component';
import { MatCard }                                                                     from '@angular/material/card';
import { Notyf }                                                                       from 'notyf';
import { DropzoneCdkModule, FileInputValidators }                                      from '@ngx-dropzone/cdk';
import { MAT_DIALOG_DATA, MatDialogRef }                                               from '@angular/material/dialog';
import { AlbumsService }                                                               from '@modules/admin/admin/albums/albums.service';
import { IAlbum }                                                                      from '@modules/admin/apps/albums/interfaces/album.interface';
import { MatProgressSpinner }                                                          from '@angular/material/progress-spinner';
import { asyncScheduler, catchError, forkJoin, Observable, scheduled, takeUntil, tap } from 'rxjs';
import { IAlbumImage }                                                                 from '@modules/admin/apps/albums/interfaces/album-image.interface';

@Component({
    selector   : 'app-upload-images',
    standalone : true,
    imports: [
        TranslocoDirective,
        MatIcon,
        MatIconButton,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatChipRow,
        DropzoneMaterialModule,
        DropzoneCdkModule,
        ImageUploadPreviewComponent,
        MatCard,
        MatSuffix,
        MatButton,
        MatProgressSpinner
    ],
    templateUrl: './upload-images.component.html',
})
export class UploadImagesComponent implements OnInit {
    @ViewChildren(ImageUploadPreviewComponent) previews!: ImageUploadPreviewComponent[];
    album!: IAlbum;
    albumImagesForm: UntypedFormGroup;
    notyf = new Notyf();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { album: Observable<IAlbum> },
        public readonly _matDialogRef: MatDialogRef<UploadImagesComponent>,
        private readonly _translocoService: TranslocoService,
        private readonly _formBuilder: UntypedFormBuilder,
        private readonly _albumsService: AlbumsService
    ) {
        this.data.album
            .pipe(takeUntil(this._matDialogRef.afterClosed()))
            .subscribe(album => {
                this.album = album;
            });
    }

    ngOnInit(): void {
        this.albumImagesForm = this._formBuilder.group({
            images: [ undefined, [ Validators.required, FileInputValidators.accept('image/*') ] ]
        });
    }

    uploadFile(file: File) {
        const component = this; // Save reference to this
        this._albumsService.addImageToAlbum(this.album.id, file).subscribe({
            next(response: { progress: number, response?: IAlbumImage[] }) {
                console.log('Upload response:', response);
                if (response.progress) {
                    console.log('Upload progress:', response.progress);
                    const preview = component.getPreviewComponent(file);
                    console.log('Preview:', preview);
                    preview?.setUploadProgress(response.progress);
                }
            },
            error(err) {
                console.error('Error uploading file:', err);
                // Handle retry logic here
            }
        });
    }

    remove(file: File) {
        const files = this.albumImagesForm.get('images')?.value as File[];
        const index = files.indexOf(file);
        if (index >= 0) {
            files.splice(index, 1);
            this.albumImagesForm.patchValue({images: files});
        }
    }

    getPreviewComponent(file: File): ImageUploadPreviewComponent | undefined {
        for (let preview of this.previews) {
            if (preview.file === file) {
                return preview;
            }
        }

        return undefined;
    }

    uploadAll() {
        this.albumImagesForm.disable();
        const files = this.albumImagesForm.get('images')?.value as File[];
        const uploadObservables: Observable<{ progress: number, response?: IAlbumImage[] }>[] = files.map(file =>
            this._albumsService.addImageToAlbum(this.album.id, file).pipe(
                tap(response => {
                    if (response.progress) {
                        console.log('Upload progress:', response.progress);
                        const preview = this.getPreviewComponent(file);
                        preview?.setUploadProgress(response.progress);
                    }
                }),
                catchError(err => {
                    console.error('Error uploading file:', err);
                    return scheduled([ {progress: 0} ], asyncScheduler);
                })
            )
        );

        forkJoin(uploadObservables).subscribe({
            next : responses => {
                console.log('All uploads completed', responses);
                this.notyf.success({
                    message : this._translocoService.translate('messages.upload-complete'),
                    position: {x: 'right', y: 'top'},
                    duration: 5000
                });
                this._matDialogRef.close();
            },
            error: err => {
                console.error('Error in one or more uploads', err);
                // remove already uploaded images
                for (let preview of this.previews) {
                    if (preview.isUploaded) this.remove(preview.file);
                }
                this.notyf.error({
                    message : this._translocoService.translate('errors.service.message'),
                    position: {x: 'right', y: 'top'}
                });
                this.albumImagesForm.enable();
            }
        });
    }
}
