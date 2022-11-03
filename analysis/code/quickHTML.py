#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Jun 13 16:42:17 2020

@author: jakeparker
"""
from subprocess import call

#custom styles can be inserted here
styles = {
          "light" : '''
          body { margin: 10px 10px; background-color: #F5F5F5; font-size: 100%; }
          figure { break-inside: avoid; margin: 4px 4px; max-width: 100%; display: inline-block; }
          img { max-width: 100%; }
          figcaption { padding: 2px; text-align: center; font-family: Arial, sans-serif; background-color: #FFFFFF; }
          p { font-size: 1em; font-family: DejaVu Sans Mono, Courier, monospace; background-color: #FFFFFF; padding: 5px; }
          h1, h2, h3, h4, h5, h6 { font-family: Arial, sans-serif; background-color: #FFFFFF; padding: 5px; }
          table, th, td { border: 1px solid black; border-collapse: collapse; }
          table { background-color: #FFFFFF; }
          th, td { padding: 8px; }
          th { font-family: Arial, sans-serif; }
          td { text-align: center; font-family: DejaVu Sans Mono, Courier, monospace; }''', \
          \
          "dark" : '''
          body { margin: 10px 10px; background-color: #181818; font-size: 100%; }
          figure { break-inside: avoid; margin: 5px 5px; max-width: 100%; display: inline-block; }
          img { max-width: 100%; }
          figcaption { padding: 2px; text-align: center; font-family: Arial, sans-serif; color: #F8F8F8; background-color: #303030; }
          p { font-size: 1em; font-family: DejaVu Sans Mono, Courier, monospace; color: #F8F8F8; background-color: #303030; padding: 5px; }
          h1, h2, h3, h4, h5, h6 { font-family: Arial, sans-serif; background-color: #303030; color: #F8F8F8; padding: 5px; }
          table, th, td { border: 2px solid #181818; border-collapse: collapse; color: #F8F8F8; }
          table { background-color: #303030; }
          th, td { padding: 8px; font-color: #F8F8F8; }
          th { font-family: Arial, sans-serif; }
          td { text-align: center; font-family: DejaVu Sans Mono, Courier, monospace; }''', \
          \
          "printer-friendly": '''
          body { margin: 10px 10px; background-color: #FFFFFF; font-size: 100%; }
          figure { break-inside: avoid; margin: 4px 4px; max-width: 100%; display: inline-block; border: 1px solid black; }
          img { max-width: 100%; }
          figcaption { padding: 2px; text-align: center; font-family: Arial, sans-serif; border: }
          p { font-size: 1em; font-family: DejaVu Sans Mono, Courier, monospace; padding: 5px; border: 1px solid black; }
          h1, h2, h3, h4, h5, h6 { font-family: Arial, sans-serif; padding: 5px; border: 1px solid }
          table, th, td { border: 1px solid black; border-collapse: collapse; }
          th, td { padding: 8px; }
          th { font-family: Arial, sans-serif; }
          td { text-align: center; font-family: DejaVu Sans Mono, Courier, monospace; }''', \
          \
          "new": '''
          body { margin: 0px 0px; border-style: solid; border-color: #303030; border-width: 20px 50px; padding: 5px; background-color: #FFFFFF; font-size: 100%; }
          figure { break-inside: avoid; margin: 4px 4px; max-width: 100%; display: inline-block; border: 1px solid black; }
          img { max-width: 100%; }
          figcaption { padding: 2px; text-align: center; font-family: Arial, sans-serif; border: }
          p { font-size: 1em; font-family: DejaVu Sans Mono, Courier, monospace; padding: 5px; border: 1px solid black; }
          h1, h2, h3, h4, h5, h6 { font-family: Arial, sans-serif; padding: 5px; border: 1px solid }
          table, th, td { border: 1px solid black; border-collapse: collapse; }
          th, td { padding: 8px; }
          th { font-family: Arial, sans-serif; }
          td { text-align: center; font-family: DejaVu Sans Mono, Courier, monospace; }'''  
          }

class html:
    
    def __init__(self, filename, lang="en", charset="UTF-8", style='light'):
        self.filename = filename
        self.lang = lang
        self.charset = charset
        self.body_text = '''
    <body>'''
        self.style = css_to_dict(styles[style])

    def write_header(self, header, size='h2', header_style_pairs=[]):
        self.body_text += '''
        ''' + create_tag(size, header_style_pairs) + header + '''</''' + size + '''>'''
            
    def write_figure(self, image_file, caption='', width='', height='', inline=False, newline=False, figure_style_pairs=[], image_style_pairs=[], caption_style_pairs=[]):
        if newline or not inline:
            self.body_text += '''
        <br clear="all" />'''
        self.body_text += '''
        ''' + create_tag('figure',figure_style_pairs)
        self.body_text += '''
            <img src="''' + image_file + '''" style="width: ''' + str(width) + '''px; height: ''' + str(height) + '''px; ''' + style_pairs_to_str(image_style_pairs) + '''">'''
        if caption:
            self.body_text += '''
            ''' + create_tag('figcaption',caption_style_pairs) + caption + '''</figcaption>'''
        self.body_text += '''
        </figure>'''
        if not inline:
            self.body_text += '''
        <br clear="all" />'''
            
        
    def write_text(self, text, text_style_pairs=[]):
        self.body_text += '''
        ''' + create_tag('p',text_style_pairs) + '''
            ''' + text + '''
        </p>'''
            
    def write_table(self, data,col_headers=[], row_headers=[], float_format='{: .5g}', table_style_pairs=[], header_style_pairs=[], data_style_pairs=[]):
        self.body_text += '''
        ''' + create_tag('table',table_style_pairs)
        try:
            col_headers = list(data.columns)
            data = data.values
        except:
            pass
        if col_headers:
            self.body_text += '''
            <tr>'''
            if row_headers:
                self.body_text += '''
                ''' + create_tag('th',header_style_pairs) + '''</th>'''
            for ch in col_headers:
                self.body_text += '''
                ''' + create_tag('th',header_style_pairs) + str(ch) + '''</th>'''
            self.body_text += '''
            </tr>'''
        for ii in range(len(data)):
            self.body_text += '''
            <tr>'''
            if row_headers:
                self.body_text += '''
                ''' + create_tag('th',header_style_pairs) + str(row_headers[ii]) + '''</th>'''
            for d in data[ii]:
                if isinstance(d,(float,complex)):
                    self.body_text += '''
                ''' + create_tag('td',data_style_pairs) + float_format.format(d) + '''</td>'''
                else:
                    self.body_text += '''
                ''' + create_tag('td',data_style_pairs) + str(d) + '''</td>'''
            self.body_text += '''
            </tr>'''
        self.body_text += '''
        </table>
        <br clear="all" />'''
       
    def set_style(self, tag, style_pairs):
        if isinstance(style_pairs,tuple):
            self.style[tag][style_pairs[0]] = style_pairs[1]
        elif isinstance(style_pairs,list):
            for prop, val in style_pairs:
                self.style[tag][prop] = val
        
    def save(self):
        self.head_text = '''
<!DOCTYPE html>
    <html lang="''' + self.lang + '''">
    <head>
        <meta charset="''' + self.charset + '''">
        <title>"''' + self.filename + '''"</title>
        <style>'''
        for tag in self.style:
            self.head_text += '''
            ''' + tag + ''' { ''' + style_pairs_to_str(list(self.style[tag].items())) + '}'
        self.head_text += '''
        </style>
    </head>'''
        self.body_text += '''
    </body>
    </html>'''
        outfile = open(self.filename,'w')
        outfile.write(self.head_text)
        outfile.write(self.body_text)
        outfile.close
        
    def save_as_pdf(self, page_size='A4', page_orientation='Portrait', page_margin='5mm', arg_pairs=[]):
        self.set_style('body',[('margin','0px'),('border-width','0px'),('padding','0px')])
        self.save()
        call_list = ['wkhtmltopdf','--enable-local-file-access','-s',page_size,'-O',page_orientation, \
                    '-B',page_margin,'-T',page_margin,'-L',page_margin,'-R',page_margin]
        if arg_pairs:
            if isinstance(arg_pairs,tuple):
                call_list.extend(arg_pairs)
            elif isinstance(arg_pairs,list):
                for pair in arg_pairs:
                    call.list.extend(pair)
        call_list.extend([self.filename,self.filename + '.pdf'])
        try:
            call(call_list)
        except FileNotFoundError:
            print('Save as PDF failed: wkhtmltopdf call failed')
            print('Install from wkhtmltopdf.org or check installation')
            
            
def style_pairs_to_str(style_pairs):
    style_str = ''
    if isinstance(style_pairs,tuple):
        style_str += style_pairs[0] + ': ' + style_pairs[1] + '; '
    elif isinstance(style_pairs,list):
        for prop, val in style_pairs:
            style_str += prop + ': ' + val + '; '
    return style_str

def css_to_dict(css_file_str):
    style_dict = dict()
    blocks = css_file_str.split('}')
    for b in blocks:
        if '{' not in b: continue
        tag = b.split('{')[0].strip()
        style_dict[tag] = dict()
        props = b.split('{')[1].split(';')
        for p in props:
            if ':' not in p: continue
            prop = p.split(':')[0].strip()
            style_dict[tag][prop] = p.split(':')[1].strip()
    return style_dict

def create_tag(tag, style_pairs):
    if not style_pairs:
        return '<' + tag + '>'
    else:
        return '<' + tag + ' style="' + style_pairs_to_str(style_pairs) + '">'