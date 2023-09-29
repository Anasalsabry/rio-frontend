import API from "@/helpers/API";

const JsonJwtProvider = {
  getList: (resource, params) => {
    return API.get(
      `/admin/${resource}?skip=${
        (params?.pagination?.page - 1) * params?.pagination?.perPage
      }&limit=${params?.pagination?.perPage}&sord_field=${
        params?.sort?.field
      }&sort_order=${params?.sort?.order}`
    ).then(({ data: { results, count } }) => ({
      data: results,
      total: count,
    }));
  },
  getOne: (resource, params) => {
    return API.get(
      `/admin/${resource}/${params.id}` +
        (resource === "products"
          ? `?sold=${params?.meta?.sold}&skip=${
              params?.meta?.page * params?.meta?.perPage
            }&limit=${params?.meta?.perPage}`
          : "")
    ).then(({ data }) => ({
      data,
    }));
  },
  update: (resource, params) => {
    if (resource === "products") {
      const imagesource = params?.data?.image_url;
      delete params?.data?.image_url;
      if (imagesource?.rawFile instanceof File) {
        const formData = new FormData();
        console.log(imagesource);
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        formData.append("file", imagesource?.rawFile);
        API.post(`/admin/products/uploadimage/${params?.id}`, formData, config)
          .then(({ data }) => ({
            data,
          }))
          .catch((err) => {
            console.error(err);
          });
      }
    }
    return API.put(`/admin/${resource}/${params.id}`, params?.data).then(
      ({ data }) => ({
        data,
      })
    );
  },
  create: (resource, params) => {
    return API.post(`/admin/${resource}/`, params?.data).then(({ data }) => ({
      data,
    }));
  },
  delete: (resource, params) => {
    return API.delete(`/admin/${resource}/${params.id}`).then(({ data }) => ({
      data,
    }));
  },
  getMany: (resource, params) => {
    return API.get(`/admin/${resource}?ids=[${params?.ids?.toString()}]`).then(
      ({ data: { results, count } }) => ({
        data: results,
        total: count,
      })
    );
  },
  createProductInstances: (id, data) => {
    return API.post(`/admin/products/productinstances/${id}`, data).then(
      ({ data }) => ({
        data,
      })
    );
  },
  /* For user password change */
  changepw: (id, newpassword) => {
    return API.post(`/admin/users/${id}/changepw`, {
      new_password: newpassword,
    }).then(({ data }) => ({
      data,
    }));
  },
};
export default JsonJwtProvider;
