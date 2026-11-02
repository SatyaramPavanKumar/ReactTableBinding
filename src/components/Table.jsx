
import { useEffect, useState } from 'react';

import DataTable from 'datatables.net-react';
import DtCore from 'datatables.net-dt';

import 'datatables.net-buttons-dt';
import 'datatables.net-dt/css';

import jszip from 'jszip'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts';

DataTable.use(DtCore);

DtCore.Buttons.jszip(jszip);
DtCore.Buttons.pdfMake(pdfMake);

function Table() {

    const [post1, setPost1] = useState([]);

    useEffect(() => {

        async function apiGet() {

            try {
                const response = await fetch(
                    'https://jsonplaceholder.typicode.com/posts'
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                setPost1(data);
            }
            catch (exception) {
                console.error(exception.message);
            }

        }

        apiGet();

    }, []);

const options = {
    paging: true,
    searching: true,
    ordering: true,
    pageLength: 10,

layout: {
    topStart: {
        buttons: [
            
{
    extend: 'excelHtml5',
    title: 'Posts Report',

    customize: function (xlsx) {

        const sheet = xlsx.xl.worksheets['sheet1.xml'];
        const styles = xlsx.xl['styles.xml'];

        const cellXfs = styles.getElementsByTagName('cellXfs')[0];

        // Existing style 25 has thin borders
        const borderStyle = cellXfs.children[25];

        // Clone border style
        const newStyle = borderStyle.cloneNode(true);

        // Add center alignment and wrap text
        let alignment = newStyle.getElementsByTagName('alignment')[0];

        if (!alignment) {
            alignment = styles.createElement('alignment');
            newStyle.appendChild(alignment);
        }

        alignment.setAttribute('horizontal', 'center');
        alignment.setAttribute('vertical', 'center');
        alignment.setAttribute('wrapText', '1');

        // Create new Excel style
        const newStyleIndex = cellXfs.children.length;

        cellXfs.appendChild(newStyle);
        cellXfs.setAttribute('count', cellXfs.children.length);

        // Apply style to every exported cell
        const cells = sheet.getElementsByTagName('c');

        for (let i = 0; i < cells.length; i++) {
            cells[i].setAttribute('s', newStyleIndex);
        }
    }
},

{
    extend: 'pdfHtml5',
    title: 'Posts Report',
    orientation: 'landscape',
    pageSize: 'A4',

    customize: function (doc) {

        // Default styles
        doc.defaultStyle = doc.defaultStyle || {};

        doc.defaultStyle.alignment = 'center';
        doc.defaultStyle.fontSize = 8;

        // Find exported table
        const tableNode = doc.content.find(
            item => item.table
        );

        if (!tableNode) return;

        // Table borders
        tableNode.layout = {
            hLineWidth: function () {
                return 0.5;
            },

            vLineWidth: function () {
                return 0.5;
            },

            hLineColor: function () {
                return '#000000';
            },

            vLineColor: function () {
                return '#000000';
            },

            paddingLeft: function () {
                return 4;
            },

            paddingRight: function () {
                return 4;
            },

            paddingTop: function () {
                return 4;
            },

            paddingBottom: function () {
                return 4;
            }
        };

    }
}
        ]
    }
}
};

    return (
        <div>
            <h2>Posts Data</h2>

            <DataTable
                data={post1}
                columns={[
                    { title: 'ID', data: 'id' },
                    { title: 'User ID', data: 'userId' },
                    { title: 'Title', data: 'title' },
                    { title: 'Body', data: 'body' }
                ]}
                options={options}
                className="display"
            />

        </div>
    );
}

export default Table;
