export interface APIResponse<T> {
  statusCode: number;
  body: {
    message?: string;
    response?: T;
    error?: {
      message: string;
      details?: any;
    };
  };
}

export interface DeletedProductResponse {
  id: number | string;
}

export interface BaseDataPresenter<DataType, ResponseType> {
  toJSON(data: DataType): ResponseType;
  toResponse(
    data: DataType | null,
    message?: string,
    isCreated?: boolean,
    isDeleted?: { deletedId: number | string }
  ): APIResponse<ResponseType | { response: number | string; message: string }>;
}

export interface ListableDataPresenter<DataType, ResponseType>
  extends BaseDataPresenter<DataType, ResponseType> {
  toResponseList(
    data: DataType[] | null,
    message?: string
  ): APIResponse<ResponseType[]>;

  toResponseDeleted?(
    data: number | string,
    message?: string
  ): APIResponse<DeletedProductResponse>;
}
