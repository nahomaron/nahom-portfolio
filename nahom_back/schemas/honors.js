// export default {
//     name: 'honors',
//     title: 'Honors and Awards',
//     type: 'document',
//     fields: [
//         {
//             name: 'name',
//             title: 'name',
//             type: 'string'
//         },
//         {
//             name: 'company',
//             title: 'Company',
//             type: 'string'
//         },
//         {
//             name: 'desc',
//             title: 'Desc',
//             type: 'string'
//         },
//          {
//             name: 'year',
//             title: 'Year',
//             type: 'number'
//         }
//     ]
// }

export default {
    name: 'honors',
    title: 'Honors',
    type: 'document',
    fields: [
        {
            name: 'year',
            title: 'Year',
            type: 'string',
            validation: (Rule) => Rule.required().max(20),
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule) => Rule.required().max(160),
        },
        {
            name: 'company',
            title: 'Company',
            type: 'string',
            validation: (Rule) => Rule.required().max(160),
        },
        {
            name: 'desc',
            title: 'Desc',
            type: 'string',
            validation: (Rule) => Rule.required().max(500),
        },
        {
            name: 'imgUrl',
            title: 'ImgUrl',
            type: 'image',
            options: {
                hotspot: true,
            },
            validation: (Rule) => Rule.required(),
        },
    ]
}
